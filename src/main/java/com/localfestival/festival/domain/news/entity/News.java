package com.localfestival.festival.domain.news.entity;

import com.localfestival.festival.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "news")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class News extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Boolean important;

    @Column(nullable = false)
    private Integer views;

    @Builder
    public News(String title, String content, Boolean important) {
        this.title = title;
        this.content = content;
        this.important = important != null ? important : false;
        this.views = 0;
    }

    // 조회수 증가
    public void increaseViews() {
        this.views++;
    }

    // 수정
    public void update(String title, String content, Boolean important) {
        if (title != null) {
            this.title = title;
        }
        if (content != null) {
            this.content = content;
        }
        if (important != null) {
            this.important = important;
        }
    }
}
