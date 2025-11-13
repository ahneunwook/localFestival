package com.localfestival.festival.domain.festival.dto.request;

import lombok.Getter;
import lombok.Setter;

/**
 * 축제 검색 요청 DTO
 * - GET /api/festivals?region=서울&category=음악
 */
@Getter
@Setter
public class FestivalSearchRequest {
    
    private String region;          // 지역 필터
    private String category;        // 카테고리 필터
    private String keyword;         // 검색 키워드 (제목, 내용)
    private String eventStatus;     // SCHEDULED, ONGOING, ENDED
    private String sortBy;          // 정렬 기준 (startDate, title 등)
    private String sortOrder;       // ASC, DESC
    private Integer page;           // 페이지 번호 (1부터 시작)
    private Integer size;           // 페이지 크기 (기본 20)
    
    public FestivalSearchRequest() {
        this.page = 1;
        this.size = 20;
        this.sortBy = "startDate";
        this.sortOrder = "ASC";
    }
}
