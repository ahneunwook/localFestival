package com.localfestival.festival.domain.festival.dto.response;

import com.localfestival.festival.domain.festival.entity.Festival;
import lombok.Builder;

@Builder
public record FestivalSearchNameResponse(Long id, String name) {

    public static FestivalSearchNameResponse festivalSearchNameResponse(Festival festival){
        return FestivalSearchNameResponse.builder()
                .id(festival.getId())
                .name(festival.getTitle())
                .build();
    }
}
