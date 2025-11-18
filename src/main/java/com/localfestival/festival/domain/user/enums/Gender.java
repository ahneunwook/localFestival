package com.localfestival.festival.domain.user.enums;

import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Gender {
    MALE, FEMALE;

    public static Gender from(String value){
        return Arrays.stream(values())
                .filter(g -> g.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_GENDER_VALUE));
    }
}
