package com.localfestival.festival.domain.festival.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.localfestival.festival.domain.festival.dto.request.FestivalSearchRequest;
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
    public ResponseEntity<BaseResponse<Map<String, Object>>> getAllFestivals(
            @RequestParam(value = "page", defaultValue = "0") int page) {
        Map<String, Object> result = festivalService.getAllActiveFestivals(page);
        return BaseResponse.success(HttpStatus.OK, "축제 목록 조회 성공", result);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getFestivalsByCategory(
            @PathVariable("category") String category,
            @RequestParam(value = "page", defaultValue = "0") int page) {
        Map<String, Object> result = festivalService.getFestivalsByCategory(category, page);
        return BaseResponse.success(HttpStatus.OK, "카테고리별 축제 조회 성공", result);
    }

    @GetMapping("/region/{region}")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getFestivalsByRegion(
            @PathVariable("region") String region,
            @RequestParam(value = "page", defaultValue = "0") int page) {
        Map<String, Object> result = festivalService.getFestivalsByRegion(region, page);
        return BaseResponse.success(HttpStatus.OK, "지역별 축제 조회 성공", result);
    }

    @GetMapping("/ongoing")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getOngoingFestivals(
            @RequestParam(value = "page", defaultValue = "0") int page) {
        Map<String, Object> result = festivalService.getOngoingFestivals(page);
        return BaseResponse.success(HttpStatus.OK, "진행 중인 축제 조회 성공", result);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getUpcomingFestivals(
            @RequestParam(value = "page", defaultValue = "0") int page) {
        Map<String, Object> result = festivalService.getUpcomingFestivals(page);
        return BaseResponse.success(HttpStatus.OK, "예정된 축제 조회 성공", result);
    }
    
    // 축제 검색
    @GetMapping("/search")
    public ResponseEntity<BaseResponse<List<FestivalListResponse>>> searchFestivals(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "region", required = false) String region,
            @RequestParam(value = "category", required = false) String category) {
        FestivalSearchRequest request = new FestivalSearchRequest();
        request.setKeyword(keyword);
        request.setRegion(region);
        request.setCategory(category);
        List<FestivalListResponse> result = festivalService.searchFestivals(request);
        return BaseResponse.success(HttpStatus.OK, "축제 검색 성공", result);
    }
}
