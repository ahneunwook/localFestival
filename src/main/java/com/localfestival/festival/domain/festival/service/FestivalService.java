package com.localfestival.festival.domain.festival.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.localfestival.festival.domain.festival.dto.request.FestivalSearchRequest;
import com.localfestival.festival.domain.festival.dto.response.FestivalResponse;
import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.festival.dto.response.FestivalListResponse;
import com.localfestival.festival.domain.festival.repository.FestivalRepository;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import com.localfestival.festival.global.common.PageResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FestivalService {
    private final FestivalRepository festivalRepository;
    
    // 전체 활성화된 축제 목록
    public PageResponse<FestivalListResponse> getAllActiveFestivals(Pageable pageable) {
        Page<FestivalListResponse> festivalPage = festivalRepository.findByIsActiveTrue(pageable)
                .map(FestivalListResponse::from);
        
        return PageResponse.from(festivalPage);
    }

    // 지역별 조회
    public PageResponse<FestivalListResponse>  getFestivalsByRegion(String region, Pageable pageable) {
        Page<FestivalListResponse> festivalPage = festivalRepository.findByRegion(region, pageable)
                .map(FestivalListResponse::from);
        
        return PageResponse.from(festivalPage);
    }

    // 카테고리별 조회
    public PageResponse<FestivalListResponse> getFestivalsByCategory(String category, Pageable pageable) {
        Page<FestivalListResponse> festivalPage = festivalRepository.findByCategory(category, pageable)
                .map(FestivalListResponse::from);
        
        return PageResponse.from(festivalPage);
    }

    // 진행 중인 축제
    public PageResponse<FestivalListResponse> getOngoingFestivals(Pageable pageable) {
        LocalDate today = LocalDate.now();
        Page<FestivalListResponse> festivalPage = festivalRepository.findOngoingFestivals(today, pageable)
                .map(FestivalListResponse::from);
        
        return PageResponse.from(festivalPage);
    }

    // 예정된 축제
    public PageResponse<FestivalListResponse> getUpcomingFestivals(Pageable pageable) {
        LocalDate today = LocalDate.now();
        Page<FestivalListResponse> festivalPage = festivalRepository.findUpcomingFestivals(today, pageable)
                .map(FestivalListResponse::from);

        return PageResponse.from(festivalPage);
    }
    
    // 축제 상세 조회
    public FestivalResponse getFestivalById(Long id) {
        Festival festival = festivalRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.FESTIVAL_NOT_FOUND));
        
        return FestivalResponse.from(festival);
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
