package com.localfestival.festival.domain.festival.repository;

import com.localfestival.festival.domain.festival.dto.response.FestivalSearchNameResponse;
import com.localfestival.festival.domain.festival.dto.response.RegionCountResponse;
import com.localfestival.festival.domain.festival.dto.response.RegionCountResult;
import com.localfestival.festival.domain.festival.entity.Festival;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FestivalRepository extends JpaRepository<Festival, Long> {

    Optional<Festival> findByUniqueKey(String uniqueKey);

    List<Festival> findByIsActiveTrue();
 
    // 페이징
    Page<Festival> findByIsActiveTrue(Pageable pageable);

    Page<Festival> findByCategory(String category, Pageable pageable);

    Page<Festival> findByRegion(String region, Pageable pageable);

    @Query("SELECT f FROM Festival f WHERE f.startDate <= :date AND f.endDate >= :date AND f.isActive = true")
    Page<Festival> findOngoingFestivals(@Param("date") LocalDate date, Pageable pageable);

    @Query("SELECT f FROM Festival f WHERE f.startDate > :date AND f.isActive = true")
    Page<Festival> findUpcomingFestivals(@Param("date") LocalDate date, Pageable pageable);

    @Query("SELECT f FROM Festival f WHERE f.lastSyncedAt < :date OR f.lastSyncedAt IS NULL")
    List<Festival> findFestivalsNeedingSync(@Param("date") LocalDate date);

    @Query("SELECT f FROM Festival f WHERE f.isActive = true " +
           "AND (:keyword IS NULL OR :keyword = '' OR f.title LIKE %:keyword% OR f.description LIKE %:keyword%) " +
           "AND (:region IS NULL OR :region = '' OR f.region = :region) " +
           "AND (:category IS NULL OR :category = '' OR f.category = :category)")
    List<Festival> searchFestivals(
            @Param("keyword") String keyword,
            @Param("region") String region,
            @Param("category") String category,
            Sort sort);

    boolean existsByUniqueKey(String uniqueKey);

    @Query("""
        SELECT new com.localfestival.festival.domain.festival.dto.response.RegionCountResult(
            f.region, count(f)
        )
         FROM Festival f
          WHERE f.endDate >= :today
          GROUP BY f.region
         """)
    List<RegionCountResult> countByRegion(@Param("today") LocalDate today);

    @Query("""
        SELECT new com.localfestival.festival.domain.festival.dto.response.FestivalSearchNameResponse(
            f.id, f.title
        )
         FROM Festival f
          WHERE f.title like %:title%
         """)
    List<FestivalSearchNameResponse> findByTitleFestivals(String title);
}