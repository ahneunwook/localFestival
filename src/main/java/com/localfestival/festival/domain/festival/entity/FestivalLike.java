package com.localfestival.festival.domain.festival.entity;

import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "festival_likes", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "festival_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FestivalLike extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id", nullable = false)
    private Festival festival;

    @Builder
    public FestivalLike(User user, Festival festival) {
        this.user = user;
        this.festival = festival;
    }

    public static FestivalLike create(User user, Festival festival) {
        return FestivalLike.builder()
                .user(user)
                .festival(festival)
                .build();
    }
}
