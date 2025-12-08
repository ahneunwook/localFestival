package com.localfestival.festival.domain.festival.dto.response;

import com.localfestival.festival.domain.festival.entity.Festival;
import lombok.Builder;

@Builder
public record RegionCountResponse(String region, long count) {

    public static RegionCountResponse regionCountResponse(String region, long count){
        return RegionCountResponse.builder()
                .region(region)
                .count(count == 0 ? 0 : count)
                .build();
    }
}

