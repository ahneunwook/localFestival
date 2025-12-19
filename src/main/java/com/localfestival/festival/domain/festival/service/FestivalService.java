package com.localfestival.festival.domain.festival.service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


import com.localfestival.festival.domain.festival.dto.response.FestivalSearchNameResponse;
import com.localfestival.festival.domain.review.dto.response.ReviewResponseDto;
import com.localfestival.festival.domain.review.entity.Review;
import com.localfestival.festival.domain.review.entity.ReviewImage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.localfestival.festival.domain.festival.dto.request.FestivalSearchRequest;
import com.localfestival.festival.domain.festival.dto.response.FestivalResponse;
import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.festival.dto.response.FestivalListResponse;
import com.localfestival.festival.domain.festival.dto.response.FestivalRankingResponse;
import com.localfestival.festival.domain.festival.repository.FestivalLikeRepository;
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
    private final FestivalLikeRepository festivalLikeRepository;
    
    // 전체 활성화된 축제 목록
    public PageResponse<FestivalListResponse> getAllActiveFestivals(Pageable pageable) {
        Page<FestivalListResponse> festivalPage = festivalRepository.findByIsActiveTrue(pageable)
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
    @Transactional
    public FestivalResponse getFestivalById(Long id) {
        Festival festival = festivalRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.FESTIVAL_NOT_FOUND));
        
        // 조회수 증가
        festival.incrementViewCount();
        
        return FestivalResponse.from(festival);
    }
    
    // 검색
    public PageResponse<FestivalListResponse> searchFestivals(FestivalSearchRequest request, Pageable pageable) {
        Page<FestivalListResponse> festivalPage = festivalRepository.searchFestivals(
                request.getKeyword(),
                request.getRegion(),
                request.getCategory(),
                pageable
        ).map(FestivalListResponse::from);

        return PageResponse.from(festivalPage);
    }

    public List<FestivalSearchNameResponse> searchFestivalsByTitle(String name) {
        List<FestivalSearchNameResponse> results;
        if (name == null || name.isBlank()){
            return Collections.emptyList();

        } else {
            results = festivalRepository.findByTitleFestivals(name);

        }
        return results;
    }

    // 월별 축제 조회
    public List<FestivalListResponse> getFestivalsByMonth(LocalDate startDate, LocalDate endDate) {
        return festivalRepository.findByDateRange(startDate, endDate)
                .stream()
                .map(FestivalListResponse::from)
                .collect(Collectors.toList());
    }
    
    // 좋아요순 TOP 10
    public PageResponse<FestivalRankingResponse> getTop10ByLikes(Pageable pageable) {
        Page<FestivalRankingResponse> festivalPage = festivalRepository.findTop10ByLikes(pageable)
                .map(festival -> {
                    Long likeCount = festivalLikeRepository.countByFestival(festival);
                    return FestivalRankingResponse.from(festival, likeCount);
                });
        
        return PageResponse.from(festivalPage);
    }

    // 조회순 TOP 10
    public PageResponse<FestivalRankingResponse> getTop10ByViews(Pageable pageable) {
        Page<FestivalRankingResponse> festivalPage = festivalRepository.findTop10ByIsActiveTrueOrderByViewCountDesc(pageable)
                .map(festival -> {
                    Long likeCount = festivalLikeRepository.countByFestival(festival);
                    return FestivalRankingResponse.from(festival, likeCount);
                });
        
        return PageResponse.from(festivalPage);
    }
}
