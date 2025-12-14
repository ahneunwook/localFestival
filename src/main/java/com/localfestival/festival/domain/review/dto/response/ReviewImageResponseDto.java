package com.localfestival.festival.domain.review.dto.response;

import com.localfestival.festival.domain.review.entity.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewImageResponseDto {
    private Long id;
    private String url;

    public static ReviewImageResponseDto from(ReviewImage image) {
        return ReviewImageResponseDto.builder()
                .id(image.getId())
                .url(image.getImageUrl())
                .build();
    }
}
