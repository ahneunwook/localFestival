package com.localfestival.festival.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // 공통
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "잘못된 요청 값입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    INVALID_GENDER_VALUE(HttpStatus.BAD_REQUEST, "올바르지 않은 성별 값입니다."),

    // 인증, 인가
    SERVER_EXCEPTION_JWT(HttpStatus.INTERNAL_SERVER_ERROR, "토큰이 유효하지 않습니다."),
    TOKEN_EXPIRED(HttpStatus.INTERNAL_SERVER_ERROR, "만료된 토큰입니다."),
    TOKEN_INVALID(HttpStatus.INTERNAL_SERVER_ERROR, "잘못된 형식의 토큰 입니다"),
    TOKEN_EMPTY(HttpStatus.INTERNAL_SERVER_ERROR, "토큰 정보가 비어 있습니다."),

    // 유저
    DUPLICATE_EMAIL(HttpStatus.BAD_REQUEST, "중복된 이메일 입니다."),
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "유저를 찾을 수 없습니다."),
    PASSWORD_NOT_MATCHED(HttpStatus.BAD_REQUEST, "비밀번호가 일치 하지 않습니다."),

	// 축제
    FESTIVAL_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 축제를 찾을 수 없습니다"),

    // 축제 api
    FESTIVAL_SYNC_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "데이터 동기화에 실패했습니다."),
    FESTIVAL_API_ERROR(HttpStatus.SERVICE_UNAVAILABLE, "API 호출에 실패했습니다."),
    FESTIVAL_API_RESPONSE_ERROR(HttpStatus.BAD_GATEWAY, "API 응답 형식이 올바르지 않습니다."),
	
    // 공지사항 api
	NEWS_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 공지사항을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
