package com.localfestival.festival.domain.festival.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * 축제 검색 요청 DTO
 * - GET /api/festivals/search?region=서울&category=음악
 */
@Getter
@Setter
public class FestivalSearchRequest {
    private String region;          // 지역 필터
    private String category;        // 카테고리 필터
    private String keyword;         // 검색 키워드 (제목, 내용)
    private String eventStatus;     // SCHEDULED, ONGOING, ENDED
}