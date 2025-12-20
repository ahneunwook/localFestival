package com.localfestival.festival.domain.review.service;

import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.festival.repository.FestivalRepository;
import com.localfestival.festival.domain.review.dto.response.ReviewResponseDto;
import com.localfestival.festival.domain.review.entity.Review;
import com.localfestival.festival.domain.review.entity.ReviewImage;
import com.localfestival.festival.domain.review.repository.ReviewImageRepository;
import com.localfestival.festival.domain.review.repository.ReviewRepository;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.domain.user.enums.Role;
import com.localfestival.festival.global.common.PageResponse;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import com.localfestival.festival.global.utils.LocalFileStorage;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final FestivalRepository festivalRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final LocalFileStorage fileStorage;

    @Transactional
    public ReviewResponseDto createReview(User user, Long festivalId, Integer rating, String title, String content, List<MultipartFile> images) {
        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new CustomException(ErrorCode.FESTIVAL_NOT_FOUND));

        Review review = Review.create(user, festival, rating, title, content);

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

    @Transactional(readOnly = true)
    public PageResponse<ReviewResponseDto> getReviews(Pageable pageable) {
        Page<Review> reviews = reviewRepository.findAllWithFestivalAndUser(pageable);

        // 리뷰 ID 목록 추출
        List<Long> reviewIds = reviews.getContent().stream()
                .map(Review::getId)
                .toList();

        // 이미지 전체 조회
        List<ReviewImage> allImages = reviewImageRepository.findByReviewIdIn(reviewIds);

        // 이미지들을 reviewId 기준으로 그룹핑
        Map<Long, List<ReviewImage>> imageMap = allImages.stream()
                .collect(Collectors.groupingBy(img -> img.getReview().getId()));

        List<ReviewResponseDto> dtoList = reviews.getContent().stream()
                .map(review ->
                        ReviewResponseDto.toDto(
                                review,
                                imageMap.getOrDefault(review.getId(), List.of())
                        )
                )
                .toList();

        Page<ReviewResponseDto> responseDtos = new PageImpl<>(
                dtoList,
                pageable,
                reviews.getTotalElements()
        );

        return PageResponse.from(responseDtos);
    }

    @Transactional(readOnly = true)
    public ReviewResponseDto getDetailReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        List<ReviewImage> reviewImages = reviewImageRepository.findAllByReview(review);

        return ReviewResponseDto.toDto(review, reviewImages);
    }

    @Transactional
    public ReviewResponseDto updateReview(Long reviewId, Long festivalId, Integer rating, String title, String content, List<MultipartFile> newImages, List<Long> deleteImageIds, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.isAuthor(user.getId()) && !user.getRole().equals(Role.ADMIN)){
            throw new CustomException(ErrorCode.NO_AUTHORIZATION_EDIT);
        }

        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new CustomException(ErrorCode.FESTIVAL_NOT_FOUND));

        review.update(festival, title, content, rating);

        updateReviewImages(review, newImages, deleteImageIds);

        List<ReviewImage> updatedImages = reviewImageRepository.findAllByReviewId(reviewId);

        return ReviewResponseDto.toDto(review, updatedImages);
    }

    private void updateReviewImages(Review review, List<MultipartFile> newImages, List<Long> deleteImageIds) {
        if (deleteImageIds != null && !deleteImageIds.isEmpty()){
            List<ReviewImage> imagesToDelete = reviewImageRepository.findAllById(deleteImageIds);

            // 실제 파일 저장소(S3, 로컬 등)에서도 파일 삭제
             for (ReviewImage img : imagesToDelete) {
                fileStorage.delete(img.getImageUrl());
             }

            reviewImageRepository.deleteAll(imagesToDelete);

        }

        if (newImages != null && !newImages.isEmpty()){
            for (MultipartFile file : newImages){

                String imageUrl = fileStorage.save(file);

                ReviewImage reviewImage = new ReviewImage(review, imageUrl);
                reviewImageRepository.save(reviewImage);
            }
        }
    }

    public void deleteReview(Long reviewId, User user) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.isAuthor(user.getId()) && !user.getRole().equals(Role.ADMIN)) {
            throw new CustomException(ErrorCode.NO_AUTHORIZATION_DELETE);
        }

        List<ReviewImage> images = reviewImageRepository.findAllByReviewId(reviewId);

        if (!images.isEmpty()){
            for (ReviewImage img : images){
                fileStorage.delete(img.getImageUrl());
            }
            reviewImageRepository.deleteAll(images);
        }
        reviewRepository.delete(review);
    }
}
