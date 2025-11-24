package com.localfestival.festival.domain.answer.dto.response;

import com.localfestival.festival.domain.answer.entity.Answer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerResponseDto {
    private String content;
    private LocalDateTime createdAt;

    public static AnswerResponseDto toDetailDto(Answer answer){
        return AnswerResponseDto.builder()
                .content(answer.getContent())
                .createdAt(answer.getCreatedAt())
                .build();
    }
}
