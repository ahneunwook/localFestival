package com.localfestival.festival.domain.review.dto.response;

import com.localfestival.festival.domain.question.entity.Question;
import com.localfestival.festival.domain.review.entity.Review;
import com.localfestival.festival.domain.review.entity.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class ReviewResponseDto {

    private Long festivalId;
    private Integer rating;
    private String title;
    private String content;
    private List<String> images;

    public static ReviewResponseDto toDto(Review review, List<ReviewImage> image){
        return ReviewResponseDto.builder()
                .festivalId(review.getFestival().getId())
                .rating(review.getRating())
                .title(review.getTitle())
                .content(review.getContent())
                .images(image.stream().map(ReviewImage::getImageUrl).toList())
                .build();
    }
}
