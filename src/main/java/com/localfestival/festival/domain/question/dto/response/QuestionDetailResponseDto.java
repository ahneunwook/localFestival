package com.localfestival.festival.domain.question.dto.response;

import com.localfestival.festival.domain.answer.dto.response.AnswerResponseDto;
import com.localfestival.festival.domain.question.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class QuestionDetailResponseDto {
    private Long id;
    private String title;
    private String content;
    private AnswerResponseDto answer;

    public static QuestionDetailResponseDto toQuestionDto(Question question){
        return QuestionDetailResponseDto.builder()
                .id(question.getId())
                .title(question.getTitle())
                .content(question.getContent())
                .answer(question.getAnswer() == null ? null : AnswerResponseDto.toDetailDto(question.getAnswer()))
                .build();
    }
}
