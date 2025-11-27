package com.localfestival.festival.domain.festival.repository;

import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.festival.entity.FestivalLike;
import com.localfestival.festival.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FestivalLikeRepository extends JpaRepository<FestivalLike, Long> {

    /**
     * 특정 사용자와 축제의 좋아요 여부 확인
     */
    boolean existsByUserAndFestival(User user, Festival festival);

    /**
     * 특정 사용자와 축제의 좋아요 조회
     */
    Optional<FestivalLike> findByUserAndFestival(User user, Festival festival);

    /**
     * 특정 축제의 좋아요 개수
     */
    long countByFestival(Festival festival);

    /**
     * 특정 사용자가 좋아요한 축제 목록 (페이징)
     */
    @Query("SELECT fl FROM FestivalLike fl JOIN FETCH fl.festival WHERE fl.user = :user")
    Page<FestivalLike> findByUserWithFestival(@Param("user") User user, Pageable pageable);
}
