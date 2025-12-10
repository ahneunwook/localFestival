package com.localfestival.festival.domain.festival.service;

import com.localfestival.festival.domain.festival.dto.response.FestivalResponse;
import com.localfestival.festival.domain.festival.dto.response.RegionCountResponse;
import com.localfestival.festival.domain.festival.dto.response.RegionCountResult;
import com.localfestival.festival.domain.festival.entity.FestivalRegionStats;
import com.localfestival.festival.domain.festival.repository.FestivalRegionRepository;
import com.localfestival.festival.domain.festival.repository.FestivalRegionStatsRepository;
import com.localfestival.festival.domain.festival.repository.FestivalRepository;
import com.localfestival.festival.global.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FestivalRegionService {

    private final FestivalRepository festivalRepository;
    private final FestivalRegionRepository festivalRegionRepository;
    private final FestivalRegionStatsRepository statsRepository;

    @Transactional(readOnly = true)
    public List<RegionCountResponse> getRegionCounts() {
        return statsRepository.findAll().stream()
                .map(stats -> new RegionCountResponse(stats.getRegion(), stats.getFestivalCount()))
                .toList();
    }

    @Transactional
    public void updateRegionStatistics() {
        LocalDate today = LocalDate.now();

        List<RegionCountResult> results = festivalRepository.countByRegion(today);

        for (RegionCountResult r : results) {
            FestivalRegionStats stats = statsRepository.findById(r.region()).orElse(new FestivalRegionStats());

            stats.setRegion(r.region());
            stats.setFestivalCount(r.count().intValue());
            stats.setLastUpdated(LocalDateTime.now());

            statsRepository.save(stats);
        }
    }

    @Scheduled(cron = "0 0 3 * * *")
    public void updateStatsDaily() {
        updateRegionStatistics();
    }

    @Transactional(readOnly = true)
    public PageResponse<FestivalResponse> getFestivalByRegions(String region, String status, String category, Pageable pageable) {
        Page<FestivalResponse> festivals = festivalRegionRepository
                .findByFilters(region, status, category, pageable);

        return PageResponse.from(festivals);
    }
}
