package com.localfestival.festival.domain.review.service;

import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.festival.repository.FestivalRepository;
import com.localfestival.festival.domain.review.dto.response.ReviewResponseDto;
import com.localfestival.festival.domain.review.entity.Review;
import com.localfestival.festival.domain.review.entity.ReviewImage;
import com.localfestival.festival.domain.review.repository.ReviewImageRepository;
import com.localfestival.festival.domain.review.repository.ReviewRepository;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import com.localfestival.festival.global.utils.LocalFileStorage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final FestivalRepository festivalRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final LocalFileStorage fileStorage;

    public ReviewResponseDto createReview(Long festivalId, Integer rating, String title, String content, List<MultipartFile> images) {
        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new CustomException(ErrorCode.FESTIVAL_NOT_FOUND));

        Review review = Review.create(festival, rating, title, content);

        reviewRepository.save(review);

        List<ReviewImage> savedImages = new ArrayList<>();

        if (images != null && !images.isEmpty()){
            for (MultipartFile file : images){

                String imageUrl = fileStorage.save(file);

                ReviewImage reviewImage = new ReviewImage(review, imageUrl);
                reviewImageRepository.save(reviewImage);

                savedImages.add(reviewImage);
            }
        }

        return ReviewResponseDto.toDto(review, savedImages);
    }
}
