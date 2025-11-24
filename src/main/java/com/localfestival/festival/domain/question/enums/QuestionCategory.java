package com.localfestival.festival.domain.question.enums;

import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum QuestionCategory {
    FESTIVAL("축제 관련"),
    RESERVATION("예약/참가 문의"),
    PARTNERSHIP("제휴 문의"),
    TECH_SUPPORT("기술 지원"),
    ETC("기타");

    private final String category;

    QuestionCategory(String category){
        this.category = category;
    }

    // 한글 카테고리 문자열을 받아서 그에 맞는 Enum을 찾아 반환
    public static QuestionCategory from(String category){
        return Arrays.stream(values())
                .filter(qc -> qc.getCategory().equals(category))
                .findFirst()
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_CATEGORY_VALUE));
    }
}
