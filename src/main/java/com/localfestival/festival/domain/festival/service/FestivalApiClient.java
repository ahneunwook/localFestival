package com.localfestival.festival.domain.festival.service;

import com.localfestival.festival.domain.festival.dto.external.FestivalApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * 전국문화축제표준데이터 API 클라이언트
 * 공공데이터포털 Open API
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FestivalApiClient {

    private final RestTemplate restTemplate;

    @Value("${external.api.festival.url}")
    private String apiUrl;

    @Value("${external.api.festival.key}")
    private String apiKey;

    /**
     * 전국문화축제표준데이터 API 호출
     * @param page 페이지 번호 (1부터 시작)
     * @param perPage 페이지당 데이터 개수
     * @return API 응답
     */
    public FestivalApiResponse fetchFestivals(int page, int perPage) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("serviceKey", apiKey)
                    .queryParam("pageNo", page)
                    .queryParam("numOfRows", perPage)
                    .queryParam("type", "json")
                    .build(false)
                    .toUriString();
            log.info("API Request URL: {}", url);
            log.info("Fetching festivals from API: pageNo={}, numOfRows={}", page, perPage);
            log.debug("Request URL: {}", url);
            
            FestivalApiResponse response = restTemplate.getForObject(url, FestivalApiResponse.class);
            
            if (response.getResponse() != null && response.getResponse().getHeader() != null) {
                FestivalApiResponse.Header header = response.getResponse().getHeader();
                log.info("Result Code: {}", header.getResultCode());
                log.info("Result Message: {}", header.getResultMsg());
            }

            if (response != null && response.getData() != null) {
                log.info("Successfully fetched {} festivals from API", response.getCurrentCount());
                return response;
            } else {
                log.warn("API returned empty response");
                return null;
            }
            
        } catch (Exception e) {
            log.error("Error fetching festivals from API", e);
            throw new RuntimeException("Failed to fetch festivals from external API", e);
        }
    }

    /**
     * 특정 기간의 축제 정보 가져오기
     * @param page 페이지 번호
     * @param perPage 페이지당 데이터 개수
     * @param startDate 시작일 (YYYY-MM-DD)
     * @param endDate 종료일 (YYYY-MM-DD)
     * @return API 응답
     */
    public FestivalApiResponse fetchFestivalsByDateRange(int page, int perPage, String startDate, String endDate) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("serviceKey", apiKey)
                    .queryParam("page", page)
                    .queryParam("perPage", perPage);

            // 날짜 필터가 있는 경우 추가
            if (startDate != null && !startDate.isBlank()) {
                builder.queryParam("cond[축제시작일자::GTE]", startDate);
            }
            if (endDate != null && !endDate.isBlank()) {
                builder.queryParam("cond[축제종료일자::LTE]", endDate);
            }

            String url = builder.build().encode().toUriString();

            log.info("Fetching festivals by date range: page={}, startDate={}, endDate={}", 
                    page, startDate, endDate);
            
            FestivalApiResponse response = restTemplate.getForObject(url, FestivalApiResponse.class);
            
            if (response != null) {
                log.info("Successfully fetched {} festivals", response.getCurrentCount());
                return response;
            }
            
            return null;
            
        } catch (Exception e) {
            log.error("Error fetching festivals by date range", e);
            throw new RuntimeException("Failed to fetch festivals from external API", e);
        }
    }

    /**
     * 현재 진행 중이거나 예정된 축제만 가져오기
     */
    public FestivalApiResponse fetchUpcomingFestivals(int page, int perPage) {
        LocalDate today = LocalDate.now();
        String todayStr = today.format(DateTimeFormatter.ISO_DATE);
        
        // 오늘 이후 종료되는 축제만 조회
        return fetchFestivalsByDateRange(page, perPage, null, null);
    }

    /**
     * 전체 축제 정보 가져오기
     */
    public FestivalApiResponse fetchAllFestivals(int page, int perPage) {
        return fetchFestivals(page, perPage);
    }
}