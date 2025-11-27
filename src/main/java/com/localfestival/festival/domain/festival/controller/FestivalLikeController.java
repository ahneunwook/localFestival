package com.localfestival.festival.domain.festival.controller;

import com.localfestival.festival.domain.festival.dto.response.FestivalLikeResponse;
import com.localfestival.festival.domain.festival.service.FestivalLikeService;
import com.localfestival.festival.global.common.BaseResponse;
import com.localfestival.festival.global.jwt.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/festivals/{festivalId}/like")
@RequiredArgsConstructor
public class FestivalLikeController {

    private final FestivalLikeService festivalLikeService;

    /**
     * 좋아요 토글 (추가/취소)
     */
    @PostMapping
    public ResponseEntity<BaseResponse<FestivalLikeResponse>> toggleLike(
            @PathVariable("festivalId") Long festivalId,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
    	Long userId = principal.getId();
        FestivalLikeResponse response = festivalLikeService.toggleLike(festivalId, userId);
        return BaseResponse.success(HttpStatus.OK, "좋아요 처리 완료", response);
    }

    /**
     * 축제의 좋아요 정보 조회 (좋아요 개수, 내가 좋아요 했는지)
     */
    @GetMapping
    public ResponseEntity<BaseResponse<FestivalLikeResponse>> getLikeInfo(
            @PathVariable("festivalId") Long festivalId,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        Long userId = principal != null ? principal.getId() : null;
        FestivalLikeResponse response = festivalLikeService.getLikeInfo(festivalId, userId);
        return BaseResponse.success(HttpStatus.OK, "좋아요 정보 조회 성공", response);
    }
}
