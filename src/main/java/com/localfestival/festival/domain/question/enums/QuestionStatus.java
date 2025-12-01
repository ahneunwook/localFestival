package com.localfestival.festival.domain.question.enums;

import com.localfestival.festival.domain.question.entity.Question;
import lombok.Getter;

@Getter
public enum QuestionStatus {

    PENDING("답변 대기중"),
    ANSWERED("답변 완료");

    private final String label;

    QuestionStatus(String label){
        this.label = label;
    }
}
