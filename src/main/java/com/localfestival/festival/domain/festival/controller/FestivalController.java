package com.localfestival.festival.domain.festival.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.localfestival.festival.domain.festival.dto.request.FestivalSearchRequest;
import com.localfestival.festival.domain.festival.dto.response.FestivalPageResponse;
import com.localfestival.festival.domain.festival.dto.response.FestivalResponse;
import com.localfestival.festival.domain.festival.dto.response.FestivalListResponse;
import com.localfestival.festival.domain.festival.service.FestivalService;
import com.localfestival.festival.global.common.BaseResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/festivals")
@RequiredArgsConstructor
public class FestivalController {
	
    private final FestivalService festivalService;

    // 전체 축제 목록 조회
    @GetMapping
    public ResponseEntity<BaseResponse<FestivalPageResponse<FestivalListResponse>>> getAllFestivals(
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        FestivalPageResponse<FestivalListResponse> result = festivalService.getAllActiveFestivals(pageable);
        return BaseResponse.success(HttpStatus.OK, "축제 목록 조회 성공", result);
    }

    // 카테고리별 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<BaseResponse<FestivalPageResponse<FestivalListResponse>>> getFestivalsByCategory(
            @PathVariable("category") String category,
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        FestivalPageResponse<FestivalListResponse> result = festivalService.getFestivalsByCategory(category, pageable);
        return BaseResponse.success(HttpStatus.OK, "카테고리별 축제 조회 성공", result);
    }

    // 지역별 조회
    @GetMapping("/region/{region}")
    public ResponseEntity<BaseResponse<FestivalPageResponse<FestivalListResponse>>> getFestivalsByRegion(
            @PathVariable("region") String region,
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        FestivalPageResponse<FestivalListResponse> result = festivalService.getFestivalsByRegion(region, pageable);
        return BaseResponse.success(HttpStatus.OK, "지역별 축제 조회 성공", result);
    }

    // 진행 중인 축제
    @GetMapping("/ongoing")
    public ResponseEntity<BaseResponse<FestivalPageResponse<FestivalListResponse>>> getOngoingFestivals(
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        FestivalPageResponse<FestivalListResponse> result = festivalService.getOngoingFestivals(pageable);
        return BaseResponse.success(HttpStatus.OK, "진행 중인 축제 조회 성공", result);
    }

    // 예정된 축제
    @GetMapping("/upcoming")
    public ResponseEntity<BaseResponse<FestivalPageResponse<FestivalListResponse>>> getUpcomingFestivals(
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.ASC) Pageable pageable) {
        FestivalPageResponse<FestivalListResponse> result = festivalService.getUpcomingFestivals(pageable);
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
    public ResponseEntity<BaseResponse<List<FestivalListResponse>>> searchFestivals(
            FestivalSearchRequest request,
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable) {
        List<FestivalListResponse> result = festivalService.searchFestivals(request, pageable);
        return BaseResponse.success(HttpStatus.OK, "축제 검색 성공", result);
    }
}