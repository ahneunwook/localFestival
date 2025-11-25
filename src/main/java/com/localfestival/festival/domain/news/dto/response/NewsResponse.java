package com.localfestival.festival.domain.news.dto.response;

import com.localfestival.festival.domain.news.entity.News;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record NewsResponse(
        Long id,
        String title,
        String content,
        Boolean important,
        Integer views,
        LocalDateTime createdAt
) {
    public static NewsResponse from(News news) {
        return NewsResponse.builder()
                .id(news.getId())
                .title(news.getTitle())
                .content(news.getContent())
                .important(news.getImportant())
                .views(news.getViews())
                .createdAt(news.getCreatedAt())
                .build();
    }
}
