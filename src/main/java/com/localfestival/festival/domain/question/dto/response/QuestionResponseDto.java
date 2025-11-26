package com.localfestival.festival.domain.question.dto.response;

import com.localfestival.festival.domain.question.entity.Question;
import com.localfestival.festival.domain.question.enums.QuestionCategory;
import com.localfestival.festival.domain.question.enums.QuestionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class QuestionResponseDto {

    private Long id;
    private String category;;
    private String title;
    private String authorName;
    private LocalDateTime createdAt;
    private String status;

    public static QuestionResponseDto toDto(Question question){
        return QuestionResponseDto.builder()
                .id(question.getId())
                .category(question.getCategory().getCategory())
                .title(question.getTitle())
                .authorName(question.getAuthor().getUserName())
                .createdAt(question.getCreatedAt())
                .status(question.getStatus().getLabel())
                .build();
    }
}
