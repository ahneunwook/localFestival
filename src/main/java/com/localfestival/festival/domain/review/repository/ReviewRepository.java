package com.localfestival.festival.domain.review.repository;

import com.localfestival.festival.domain.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
    SELECT r FROM Review r
    JOIN FETCH r.festival
    JOIN FETCH r.user
    """)
    Page<Review> findAllWithFestivalAndUser(Pageable pageable);
}
