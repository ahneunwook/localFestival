package com.localfestival.festival.domain.user.enums;

import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Role {
    ADMIN, USER;
}
