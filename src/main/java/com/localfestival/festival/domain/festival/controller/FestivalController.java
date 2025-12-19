package com.localfestival.festival.domain.festival.controller;

import java.time.LocalDate;
import java.util.List;

import com.localfestival.festival.domain.festival.dto.response.FestivalSearchNameResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import com.localfestival.festival.domain.festival.dto.request.FestivalSearchRequest;
import com.localfestival.festival.domain.festival.dto.response.FestivalResponse;
import com.localfestival.festival.domain.festival.dto.response.FestivalListResponse;
import com.localfestival.festival.domain.festival.dto.response.FestivalRankingResponse;
import com.localfestival.festival.domain.festival.service.FestivalService;
import com.localfestival.festival.global.common.BaseResponse;
import com.localfestival.festival.global.common.PageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/festivals")
@RequiredArgsConstructor
public class FestivalController {
	
    private final FestivalService festivalService;

    // 전체 축제 목록 조회
    @GetMapping
    public ResponseEntity<BaseResponse<PageResponse<FestivalListResponse>>> getAllFestivals(
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<FestivalListResponse> result = festivalService.getAllActiveFestivals(pageable);
        return BaseResponse.success(HttpStatus.OK, "축제 목록 조회 성공", result);
    }

    // 카테고리별 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<BaseResponse<PageResponse<FestivalListResponse>>> getFestivalsByCategory(
            @PathVariable("category") String category,
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<FestivalListResponse> result = festivalService.getFestivalsByCategory(category, pageable);
        return BaseResponse.success(HttpStatus.OK, "카테고리별 축제 조회 성공", result);
    }

    // 진행 중인 축제
    @GetMapping("/ongoing")
    public ResponseEntity<BaseResponse<PageResponse<FestivalListResponse>>> getOngoingFestivals(
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<FestivalListResponse> result = festivalService.getOngoingFestivals(pageable);
        return BaseResponse.success(HttpStatus.OK, "진행 중인 축제 조회 성공", result);
    }

    // 예정된 축제
    @GetMapping("/upcoming")
    public ResponseEntity<BaseResponse<PageResponse<FestivalListResponse>>> getUpcomingFestivals(
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.ASC) Pageable pageable) {
        PageResponse<FestivalListResponse> result = festivalService.getUpcomingFestivals(pageable);
        return BaseResponse.success(HttpStatus.OK, "예정된 축제 조회 성공", result);
    }
    
    // 축제 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<FestivalResponse>> getFestivalById(
            @PathVariable("id") Long id) {
        FestivalResponse result = festivalService.getFestivalById(id);
        return BaseResponse.success(HttpStatus.OK, "축제 상세 조회 성공", result);
    }
    
    // 축제 검색
    @GetMapping("/search")
    public ResponseEntity<BaseResponse<PageResponse<FestivalListResponse>>> searchFestivals(
            FestivalSearchRequest request,
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<FestivalListResponse> result = festivalService.searchFestivals(request, pageable);
        return BaseResponse.success(HttpStatus.OK, "축제 검색 성공", result);
    }

    @GetMapping("/month")
    public ResponseEntity<BaseResponse<List<FestivalListResponse>>> getFestivalsByMonth(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {

    	List<FestivalListResponse> result = festivalService.getFestivalsByMonth(startDate, endDate);
        return BaseResponse.success(HttpStatus.OK, "월별 축제 조회 성공", result);
    }

    // 리뷰 작성 할 때의 검색
    @GetMapping("/names")
    public ResponseEntity<BaseResponse<List<FestivalSearchNameResponse>>> searchFestivalsByTitle(
            @RequestParam(required = false) String name
    ) {
        List<FestivalSearchNameResponse> result = festivalService.searchFestivalsByTitle(name);
        return BaseResponse.success(HttpStatus.OK, "축제 검색 성공", result);
    }
    
    // 좋아요순 TOP 10
    @GetMapping("/top10/likes")
    public ResponseEntity<BaseResponse<PageResponse<FestivalRankingResponse>>> getTop10ByLikes(
            @PageableDefault(size = 10) Pageable pageable) {
        PageResponse<FestivalRankingResponse> result = festivalService.getTop10ByLikes(pageable);
        return BaseResponse.success(HttpStatus.OK, "좋아요순 TOP 10 조회 성공", result);
    }

    // 조회순 TOP 10
    @GetMapping("/top10/views")
    public ResponseEntity<BaseResponse<PageResponse<FestivalRankingResponse>>> getTop10ByViews(
            @PageableDefault(size = 10) Pageable pageable) {
        PageResponse<FestivalRankingResponse> result = festivalService.getTop10ByViews(pageable);
        return BaseResponse.success(HttpStatus.OK, "조회순 TOP 10 조회 성공", result);
    }
}