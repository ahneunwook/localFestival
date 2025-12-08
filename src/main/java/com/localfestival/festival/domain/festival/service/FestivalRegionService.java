package com.localfestival.festival.domain.festival.service;

import com.localfestival.festival.domain.festival.dto.response.FestivalResponse;
import com.localfestival.festival.domain.festival.dto.response.RegionCountResponse;
import com.localfestival.festival.domain.festival.repository.FestivalRegionRepository;
import com.localfestival.festival.domain.festival.repository.FestivalRepository;
import com.localfestival.festival.global.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FestivalRegionService {

    private final FestivalRepository festivalRepository;
    private final FestivalRegionRepository festivalRegionRepository;

    public List<RegionCountResponse> getRegionCounts() {
        LocalDate today = LocalDate.now();
        return festivalRepository.countByRegion(today);
    }

    public PageResponse<FestivalResponse> getFestivalByRegions(String region, String status, String category, Pageable pageable) {
        Page<FestivalResponse> festivals = festivalRegionRepository
                .findByFilters(region, status, category, pageable);

        return PageResponse.from(festivals);
    }
}
