package com.localfestival.festival.domain.festival.repository;

import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.festival.entity.FestivalLike;
import com.localfestival.festival.domain.festival.entity.FestivalRegionStats;
import com.localfestival.festival.domain.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FestivalRegionStatsRepository extends JpaRepository<FestivalRegionStats, String> {

}
