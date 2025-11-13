package com.localfestival.festival.domain.festival.repository;

import com.localfestival.festival.domain.festival.entity.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FestivalRepository extends JpaRepository<Festival, Long> {

    Optional<Festival> findByUniqueKey(String uniqueKey);

    List<Festival> findByIsActiveTrue();

    List<Festival> findByCategory(String category);

    List<Festival> findByRegion(String region);

    @Query("SELECT f FROM Festival f WHERE f.startDate <= :date AND f.endDate >= :date AND f.isActive = true")
    List<Festival> findOngoingFestivals(@Param("date") LocalDate date);

    @Query("SELECT f FROM Festival f WHERE f.startDate > :date AND f.isActive = true")
    List<Festival> findUpcomingFestivals(@Param("date") LocalDate date);

    @Query("SELECT f FROM Festival f WHERE f.lastSyncedAt < :date OR f.lastSyncedAt IS NULL")
    List<Festival> findFestivalsNeedingSync(@Param("date") LocalDate date);

    boolean existsByUniqueKey(String uniqueKey);
}
