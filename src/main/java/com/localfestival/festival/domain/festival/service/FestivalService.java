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
import com.localfestival.festival.domain.festival.dto.response.FestivalPageResponse;
import com.localfestival.festival.domain.festival.dto.response.FestivalListResponse;
import com.localfestival.festival.domain.festival.repository.FestivalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FestivalService {
    private final FestivalRepository festivalRepository;
    
    // 전체 활성화된 축제 목록
    public FestivalPageResponse<FestivalListResponse> getAllActiveFestivals(Pageable pageable) {
        Page<FestivalListResponse> festivalPage = festivalRepository.findByIsActiveTrue(pageable)
                .map(FestivalListResponse::from);
        
        return FestivalPageResponse.from(festivalPage);
    }

    // 지역별 조회
    public FestivalPageResponse<FestivalListResponse>  getFestivalsByRegion(String region, Pageable pageable) {
        Page<FestivalListResponse> festivalPage = festivalRepository.findByRegion(region, pageable)
                .map(FestivalListResponse::from);
        
        return FestivalPageResponse.from(festivalPage);
    }

    // 카테고리별 조회
    public FestivalPageResponse<FestivalListResponse> getFestivalsByCategory(String category, Pageable pageable) {
        Page<FestivalListResponse> festivalPage = festivalRepository.findByCategory(category, pageable)
                .map(FestivalListResponse::from);
        
        return FestivalPageResponse.from(festivalPage);
    }

    // 진행 중인 축제
    public FestivalPageResponse<FestivalListResponse> getOngoingFestivals(Pageable pageable) {
        LocalDate today = LocalDate.now();
        Page<FestivalListResponse> festivalPage = festivalRepository.findOngoingFestivals(today, pageable)
                .map(FestivalListResponse::from);
        
        return FestivalPageResponse.from(festivalPage);
    }

    // 예정된 축제
    public FestivalPageResponse<FestivalListResponse> getUpcomingFestivals(Pageable pageable) {
        LocalDate today = LocalDate.now();
        Page<FestivalListResponse> festivalPage = festivalRepository.findUpcomingFestivals(today, pageable)
                .map(FestivalListResponse::from);

        return FestivalPageResponse.from(festivalPage);
    }
    
    // 검색
    public List<FestivalListResponse> searchFestivals(FestivalSearchRequest request, Pageable pageable) {
        List<FestivalListResponse> results = festivalRepository.searchFestivals(
                request.getKeyword(),
                request.getRegion(),
                request.getCategory(),
                pageable.getSort()
        ).stream()
                .map(FestivalListResponse::from)
                .collect(Collectors.toList());

        return results;
    }
}
