package com.localfestival.festival.domain.review.dto.response;

import com.localfestival.festival.domain.review.entity.Review;
import com.localfestival.festival.domain.review.entity.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class ReviewResponseDto {

    private Long reviewId;
    private Long festivalId;
    private String festivalName;
    private Integer rating;
    private String title;
    private String content;
    private String festivalCategory;
    private String region;
    private String authorName;
    private LocalDateTime createdDate;

    private List<ReviewImageResponseDto> images;


    public static ReviewResponseDto toDto(Review review, List<ReviewImage> image){
        return ReviewResponseDto.builder()
                .reviewId(review.getId())
                .festivalId(review.getFestival().getId())
                .festivalName(review.getFestival().getTitle())
                .rating(review.getRating())
                .title(review.getTitle())
                .content(review.getContent())
                .festivalCategory(review.getFestival().getCategory())
                .region(review.getFestival().getRegion())
                .authorName(review.getUser().getUserName())
                .createdDate(review.getCreatedAt())
                .images(image.stream().map(ReviewImageResponseDto::from).toList())
                .build();
    }
}
