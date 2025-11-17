package com.localfestival.festival.domain.festival.dto.response;

import java.util.List;

import org.springframework.data.domain.Page;

import lombok.Builder;
import lombok.Getter;


/**
 * 페이징된 응답 DTO
 * 모든 페이징 목록 조회에 재사용 가능
 * 
 */
@Getter
@Builder
public class FestivalPageResponse<T> {
    private List<T> content;
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private boolean hasNext;
    private boolean isLast;
    
    public static <T> FestivalPageResponse<T> from(Page<T> page) {
        return FestivalPageResponse.<T>builder()
            .content(page.getContent())
            .currentPage(page.getNumber())
            .totalPages(page.getTotalPages())
            .totalElements(page.getTotalElements())
            .hasNext(page.hasNext())
            .isLast(page.isLast())
            .build();
    }
}