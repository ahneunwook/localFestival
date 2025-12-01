package com.localfestival.festival.domain.answer.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class AnswerRequest {

    @NotBlank(message = "답글 내용을 필수 입니다.")
    private String content;
}
