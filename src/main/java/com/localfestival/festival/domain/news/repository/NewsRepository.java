package com.localfestival.festival.domain.news.repository;

import com.localfestival.festival.domain.news.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long> {

    // 전체 목록 조회 (페이징)
    Page<News> findAllByOrderByImportantDescCreatedAtDesc(Pageable pageable);
}
