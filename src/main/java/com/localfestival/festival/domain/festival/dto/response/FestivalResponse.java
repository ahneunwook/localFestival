package com.localfestival.festival.domain.festival.dto.response;

import com.localfestival.festival.domain.festival.entity.Festival;
import lombok.Builder;

import java.time.LocalDate;

/**
 * 축제 응답 DTO
 * - 클라이언트에게 반환되는 축제 정보
 * - Entity의 민감한 정보는 제외
 */
@Builder
public record FestivalResponse(
    Long id,
    String title,
    String description,
    LocalDate startDate,
    LocalDate endDate,
    String address,
    String region,
    String category,
    String venue,
    String organizer,
    String homepageUrl,
    String tel,
    String fee,
    Double latitude,
    Double longitude,
    String eventStatus  // SCHEDULED, ONGOING, ENDED
) {
    /**
     * Entity → Response DTO 변환
     */
    public static FestivalResponse from(Festival festival) {
        return FestivalResponse.builder()
            .id(festival.getId())
            .title(festival.getTitle())
            .description(festival.getDescription())
            .startDate(festival.getStartDate())
            .endDate(festival.getEndDate())
            .address(festival.getAddress())
            .region(festival.getRegion())
            .category(festival.getCategory())
            .venue(festival.getVenue())
            .organizer(festival.getOrganizer())
            .homepageUrl(festival.getHomepageUrl())
            .tel(festival.getTel())
            .latitude(festival.getLatitude())
            .longitude(festival.getLongitude())
            .eventStatus(festival.getEventStatus())
            .build();
    }
}
