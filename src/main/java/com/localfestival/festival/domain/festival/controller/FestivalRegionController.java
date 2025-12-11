package com.localfestival.festival.domain.festival.controller;

import com.localfestival.festival.domain.festival.dto.response.FestivalResponse;
import com.localfestival.festival.domain.festival.dto.response.RegionCountResponse;
import com.localfestival.festival.domain.festival.service.FestivalRegionService;
import com.localfestival.festival.global.common.BaseResponse;
import com.localfestival.festival.global.common.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/festivals/regions")
public class FestivalRegionController {

    private final FestivalRegionService festivalRegionService;

    @GetMapping("/counts")
    public ResponseEntity<BaseResponse<List<RegionCountResponse>>> getRegionCounts(){

        List<RegionCountResponse> res = festivalRegionService.getRegionCounts();

        return BaseResponse.success(HttpStatus.OK, "조회성공을 했습니다.", res);
    }

    @GetMapping
    public ResponseEntity<BaseResponse<PageResponse<FestivalResponse>>> getFestivalByRegions(
            @RequestParam("region") String region,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 12, sort = "startDate", direction = Sort.Direction.DESC) Pageable pageable
    ){
        PageResponse<FestivalResponse> res = festivalRegionService.getFestivalByRegions(region, status, category, pageable);

        return BaseResponse.success(HttpStatus.OK, "조회성공을 했습니다.", res);
    }
}
