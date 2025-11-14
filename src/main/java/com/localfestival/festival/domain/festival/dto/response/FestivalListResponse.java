package com.localfestival.festival.domain.festival.dto.response;

import com.localfestival.festival.domain.festival.entity.Festival;
import lombok.Builder;

import java.time.LocalDate;

/**
 * 축제 목록 응답 DTO (간단한 정보만)
 * - 리스트 조회 시 사용
 * - 상세 정보는 제외하고 핵심 정보만
 */
@Builder
public record FestivalListResponse(
    Long id,
    String title,
    String description,
    String address,
    String imageUrl,
    LocalDate startDate,
    LocalDate endDate,
    String region,
    String category,
    String venue,
    String eventStatus
) {
    public static FestivalListResponse from(Festival festival) {
        return FestivalListResponse.builder()
            .id(festival.getId())
            .title(festival.getTitle())
            .description(festival.getDescription())
            .address(festival.getAddress())
            .imageUrl(festival.getImageUrl())
            .startDate(festival.getStartDate())
            .endDate(festival.getEndDate())
            .region(festival.getRegion())
            .category(festival.getCategory())
            .venue(festival.getVenue())
            .eventStatus(festival.getEventStatus())
            .build();
    }
}