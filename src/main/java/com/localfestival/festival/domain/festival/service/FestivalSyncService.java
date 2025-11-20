package com.localfestival.festival.domain.festival.service;

import com.localfestival.festival.domain.festival.dto.external.FestivalApiResponse;
import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.festival.repository.FestivalRepository;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 전국문화축제표준데이터 동기화 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FestivalSyncService {

    private final FestivalApiClient festivalApiClient;
    private final FestivalRepository festivalRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    /**
     * 외부 API에서 축제 데이터를 가져와 DB에 동기화
     */
    @Transactional
    public void syncFestivals() {
        log.info("Starting festival synchronization...");

        int page = 1;
        int perPage = 1000;
        int totalSynced = 0;
        int totalCreated = 0;
        int totalUpdated = 0;

        try {
            while (true) {
                FestivalApiResponse response = festivalApiClient.fetchAllFestivals(page, perPage);

                if (response == null || !response.isSuccess() || response.getData() == null || response.getData().isEmpty()) {
                    log.info("No more data to fetch from API");
                    break;
                }

                List<FestivalApiResponse.FestivalItem> festivalDataList = response.getData();

                for (FestivalApiResponse.FestivalItem data : festivalDataList) {
                    try {
                        if (data.getFstvlNm() == null || data.getFstvlNm().isBlank()) {
                            log.warn("Skipping festival with null name");
                            continue;
                        }

                        boolean isNew = syncFestival(data);
                        totalSynced++;

                        if (isNew) {
                            totalCreated++;
                        } else {
                            totalUpdated++;
                        }

                    } catch (Exception e) {
                        log.error("Error syncing festival: {}", data.getFstvlNm(), e);
                    }
                }

                log.info("Synced page {}: {} festivals processed", page, festivalDataList.size());

                if (response.getCurrentCount() < perPage) {
                    break;
                }

                if (response.getTotalCount() > 0 && totalSynced >= response.getTotalCount()) {
                    break;
                }

                page++;
                Thread.sleep(300);
            }

            log.info("Festival synchronization completed: Total={}, Created={}, Updated={}",
                    totalSynced, totalCreated, totalUpdated);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Festival synchronization interrupted", e);
            throw new CustomException(ErrorCode.FESTIVAL_SYNC_FAILED, "동기화 작업이 중단되었습니다");
        } catch (Exception e) {
            log.error("Error during festival synchronization", e);
            throw new CustomException(ErrorCode.FESTIVAL_SYNC_FAILED, "축제 동기화 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 개별 축제 동기화
     * @return true if created, false if updated
     */
    private boolean syncFestival(FestivalApiResponse.FestivalItem data) {
        String uniqueKey = generateUniqueKey(data.getFstvlNm(), data.getFstvlStartDate());
        
        Festival existingFestival = festivalRepository.findByUniqueKey(uniqueKey)
                .orElse(null);

        Festival festival = convertToEntity(data, uniqueKey);

        if (existingFestival == null) {
            festivalRepository.save(festival);
            log.debug("Created new festival: {}", festival.getTitle());
            return true;
        } else {
            existingFestival.updateFromApi(festival);
            existingFestival.updateEventStatus();
            festivalRepository.save(existingFestival);
            log.debug("Updated existing festival: {}", existingFestival.getTitle());
            return false;
        }
    }

    /**
     * API 응답을 Festival 엔티티로 변환
     */
    private Festival convertToEntity(FestivalApiResponse.FestivalItem data, String uniqueKey) {
        String address = data.getRdnmadr();
        if (address == null || address.isBlank()) {
            address = data.getLnmadr();
        }

        return Festival.builder()
                .uniqueKey(uniqueKey)
                .title(data.getFstvlNm())
                .description(data.getFstvlCo())
                .address(address)
                .region(extractRegion(address))
                .startDate(parseDate(data.getFstvlStartDate()))
                .endDate(parseDate(data.getFstvlEndDate()))
                .category(determineCategoryFromDescription(data.getFstvlCo()))
                .homepageUrl(data.getHomepageUrl())
                .tel(data.getPhoneNumber())
                .latitude(parseDouble(data.getLatitude()))
                .longitude(parseDouble(data.getLongitude()))
                .organizer(data.getAuspcInsttNm())
                .host(data.getMnnstNm())
                .sponsor(data.getSuprtInsttNm())
                .venue(data.getOpar())
                .relatedInfo(data.getRelateInfo())
                .isActive(true)
                .lastSyncedAt(LocalDate.now())
                .build();
    }

    private String generateUniqueKey(String festivalName, String startDate) {
        return festivalName + "_" + (startDate != null ? startDate : "NO_DATE");
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr, DATE_FORMATTER);
        } catch (Exception e) {
            log.warn("Failed to parse date: {}", dateStr);
            return null;
        }
    }

    private Double parseDouble(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Double.parseDouble(value);
        } catch (Exception e) {
            log.warn("Failed to parse double: {}", value);
            return null;
        }
    }

    private String extractRegion(String address) {
        if (address == null || address.isBlank()) {
            return "기타";
        }

        String[] parts = address.split(" ");
        if (parts.length > 0) {
            String firstPart = parts[0];
            
            if (firstPart.contains("서울")) return "서울";
            if (firstPart.contains("부산")) return "부산";
            if (firstPart.contains("대구")) return "대구";
            if (firstPart.contains("인천")) return "인천";
            if (firstPart.contains("광주")) return "광주";
            if (firstPart.contains("대전")) return "대전";
            if (firstPart.contains("울산")) return "울산";
            if (firstPart.contains("세종")) return "세종";
            if (firstPart.contains("경기")) return "경기";
            if (firstPart.contains("강원")) return "강원";
            if (firstPart.contains("충북") || firstPart.contains("충청북")) return "충북";
            if (firstPart.contains("충남") || firstPart.contains("충청남")) return "충남";
            if (firstPart.contains("전북") || firstPart.contains("전라북")) return "전북";
            if (firstPart.contains("전남") || firstPart.contains("전라남")) return "전남";
            if (firstPart.contains("경북") || firstPart.contains("경상북")) return "경북";
            if (firstPart.contains("경남") || firstPart.contains("경상남")) return "경남";
            if (firstPart.contains("제주")) return "제주";
        }

        return "기타";
    }

    private String determineCategoryFromDescription(String description) {
        if (description == null) {
            return "기타";
        }

        String lowerDesc = description.toLowerCase();

        if (lowerDesc.contains("음악") || lowerDesc.contains("뮤직") || lowerDesc.contains("음악회")) {
            return "음악";
        }
        if (lowerDesc.contains("영화") || lowerDesc.contains("필름")) {
            return "영화";
        }
        if (lowerDesc.contains("미술") || lowerDesc.contains("전시") || lowerDesc.contains("예술")) {
            return "예술";
        }
        if (lowerDesc.contains("음식") || lowerDesc.contains("먹거리") || lowerDesc.contains("푸드")) {
            return "음식";
        }
        if (lowerDesc.contains("전통") || lowerDesc.contains("한국") || lowerDesc.contains("민속")) {
            return "전통";
        }
        if (lowerDesc.contains("지역") || lowerDesc.contains("마을")) {
            return "지역축제";
        }
        if (lowerDesc.contains("문화")) {
            return "문화";
        }

        return "기타";
    }

    @Transactional
    public void updateFestivalStatuses() {
        log.info("Updating festival statuses...");
        List<Festival> festivals = festivalRepository.findByIsActiveTrue();

        int updated = 0;
        for (Festival festival : festivals) {
            festival.updateEventStatus();
            updated++;
        }

        festivalRepository.saveAll(festivals);
        log.info("Updated {} festival statuses", updated);
    }
}