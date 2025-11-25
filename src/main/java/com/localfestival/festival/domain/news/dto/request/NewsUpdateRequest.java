package com.localfestival.festival.domain.news.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record NewsUpdateRequest(
        @Size(max = 200, message = "제목은 200자를 초과할 수 없습니다.")
        String title,

        String content,

        Boolean important
) {
}
