package com.localfestival.festival.domain.question.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class QuestionRequestDto {

    @NotBlank(message = "카테고리는 필수 입니다.")
    private String category;

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotBlank(message = "내용은 필수입니다.")
    private String content;

}
