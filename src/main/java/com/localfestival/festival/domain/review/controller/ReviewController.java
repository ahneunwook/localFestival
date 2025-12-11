package com.localfestival.festival.domain.review.controller;

import com.localfestival.festival.domain.review.dto.response.ReviewResponseDto;
import com.localfestival.festival.domain.review.service.ReviewService;
import com.localfestival.festival.global.common.BaseResponse;
import lombok.RequiredArgsConstructor;
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
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) {
        ReviewResponseDto dto = reviewService.createReview(festivalId, rating, title, content, images);
        return BaseResponse.success(HttpStatus.CREATED, "리뷰작성에 성공했습니다.", dto);
    }
}
