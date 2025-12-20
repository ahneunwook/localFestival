package com.localfestival.festival.domain.review.controller;

import com.localfestival.festival.domain.review.dto.response.ReviewResponseDto;
import com.localfestival.festival.domain.review.service.ReviewService;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.common.BaseResponse;
import com.localfestival.festival.global.common.PageResponse;
import com.localfestival.festival.global.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse<ReviewResponseDto>> createReview(
            @RequestParam("festivalId") Long festivalId,
            @RequestParam("rating") Integer rating,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @CurrentUser User user
    ) {
        ReviewResponseDto dto = reviewService.createReview(user, festivalId, rating, title, content, images);
        return BaseResponse.success(HttpStatus.CREATED, "리뷰작성에 성공했습니다.", dto);
    }

    @GetMapping
    public ResponseEntity<BaseResponse<PageResponse<ReviewResponseDto>>> getReviews(
            @PageableDefault(size = 12, sort = "modifiedAt", direction = Sort.Direction.DESC) Pageable pageable
    ){
        PageResponse<ReviewResponseDto> response = reviewService.getReviews(pageable);
        return BaseResponse.success(HttpStatus.OK, "리뷰 조회 성공", response);
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<BaseResponse<ReviewResponseDto>> getDetailReview(
            @PathVariable("reviewId") Long reviewId
    ){
        ReviewResponseDto response = reviewService.getDetailReview(reviewId);

        return BaseResponse.success(HttpStatus.OK, "리뷰 조회 성공", response);
    }
}
