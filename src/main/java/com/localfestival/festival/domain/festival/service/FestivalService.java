package com.localfestival.festival.domain.festival.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.localfestival.festival.domain.festival.dto.request.FestivalSearchRequest;
import com.localfestival.festival.domain.festival.dto.response.FestivalListResponse;
import com.localfestival.festival.domain.festival.repository.FestivalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FestivalService {
    private final FestivalRepository festivalRepository;

    private static final int PAGE_SIZE = 12;
    
    // 전체 활성화된 축제 목록
    public Map<String, Object> getAllActiveFestivals(int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("startDate").descending());
        Page<FestivalListResponse> festivalPage = festivalRepository.findByIsActiveTrue(pageable)
                .map(FestivalListResponse::from);
        
        return createPageResponse(festivalPage);
    }

    // 지역별 조회
    public Map<String, Object> getFestivalsByRegion(String region, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("startDate").descending());
        Page<FestivalListResponse> festivalPage = festivalRepository.findByRegion(region, pageable)
                .map(FestivalListResponse::from);
        
        return createPageResponse(festivalPage);
    }

    // 카테고리별 조회
    public Map<String, Object> getFestivalsByCategory(String category, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("startDate").descending());
        Page<FestivalListResponse> festivalPage = festivalRepository.findByCategory(category, pageable)
                .map(FestivalListResponse::from);
        
        return createPageResponse(festivalPage);
    }

    // 진행 중인 축제
    public Map<String, Object> getOngoingFestivals(int page) {
        LocalDate today = LocalDate.now();
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("startDate").descending());
        Page<FestivalListResponse> festivalPage = festivalRepository.findOngoingFestivals(today, pageable)
                .map(FestivalListResponse::from);
        
        return createPageResponse(festivalPage);
    }

    // 예정된 축제
    public Map<String, Object> getUpcomingFestivals(int page) {
        LocalDate today = LocalDate.now();
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("startDate").ascending());
        Page<FestivalListResponse> festivalPage = festivalRepository.findUpcomingFestivals(today, pageable)
                .map(FestivalListResponse::from);
        
        return createPageResponse(festivalPage);
    }
    
    // 검색
    public List<FestivalListResponse> searchFestivals(FestivalSearchRequest request) {
        List<FestivalListResponse> results = festivalRepository.searchFestivals(
                request.getKeyword(),
                request.getRegion(),
                request.getCategory()
        ).stream()
                .map(FestivalListResponse::from)
                .collect(Collectors.toList());
        
        return results;
    }

    // 페이지 응답 생성
    private Map<String, Object> createPageResponse(Page<FestivalListResponse> page) {
        Map<String, Object> response = new HashMap<>();
        response.put("content", page.getContent());
        response.put("currentPage", page.getNumber());
        response.put("totalPages", page.getTotalPages());
        response.put("totalElements", page.getTotalElements());
        response.put("hasNext", page.hasNext());
        response.put("isLast", page.isLast());
        return response;
    }
}
