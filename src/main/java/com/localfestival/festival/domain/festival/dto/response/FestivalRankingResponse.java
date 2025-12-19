package com.localfestival.festival.domain.festival.dto.response;

import java.time.LocalDate;

import com.localfestival.festival.domain.festival.entity.Festival;

import lombok.Builder;

/**
 * 축제 TOP 10 응답 DTO
 * - TOP 10 조회 시 사용
 */
@Builder
public record FestivalRankingResponse(
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
	    String eventStatus,
	    Long viewCount,
	    Long likeCount
		) {
    public static FestivalRankingResponse from(Festival festival, Long likeCount) {
        return FestivalRankingResponse.builder()
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
            .viewCount(festival.getViewCount())
            .likeCount(likeCount)
            .build();
    }
}
