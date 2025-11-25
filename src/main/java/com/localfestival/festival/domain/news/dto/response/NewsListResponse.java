package com.localfestival.festival.domain.news.dto.response;

import com.localfestival.festival.domain.news.entity.News;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record NewsListResponse(
        Long id,
        String title,
        Boolean important,
        Integer views,
        LocalDateTime createdAt
) {
    public static NewsListResponse from(News news) {
        return NewsListResponse.builder()
                .id(news.getId())
                .title(news.getTitle())
                .important(news.getImportant())
                .views(news.getViews())
                .createdAt(news.getCreatedAt())
                .build();
    }
}
