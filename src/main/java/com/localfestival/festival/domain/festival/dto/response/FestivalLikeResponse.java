package com.localfestival.festival.domain.festival.dto.response;

public record FestivalLikeResponse(
        Long festivalId,
        long likeCount,
        boolean isLiked
) {
    public static FestivalLikeResponse of(Long festivalId, long likeCount, boolean isLiked) {
        return new FestivalLikeResponse(festivalId, likeCount, isLiked);
    }
}
