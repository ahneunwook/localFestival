package com.localfestival.festival.domain.review.entity;

import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "reviews")
@Getter
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id", nullable = false)
    private Festival festival;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(length = 2000, nullable = false)
    private String content;

    @Builder
    public Review(User user, Festival festival, Integer rating, String title, String content) {
        this.user = user;
        this.festival = festival;
        this.rating = rating;
        this.title = title;
        this.content = content;
    }

    public static Review create(User user, Festival festival, Integer rating, String title, String content){
        return Review.builder()
                .user(user)
                .festival(festival)
                .rating(rating)
                .title(title)
                .content(content)
                .build();
    }

    public void update(Festival festival, String title, String content, Integer rating) {
        this.festival = festival;
        this.title = title;
        this.content = content;
        this.rating = rating;
    }

    public boolean isAuthor(Long userId){
        return this.user.getId().equals(userId);
    }
}
