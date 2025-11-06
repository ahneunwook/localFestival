package com.localfestival.festival.global.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

@Getter
public class BaseResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;
    private final LocalDateTime timestamp;

    private BaseResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // 성공
    public static <T> ResponseEntity<BaseResponse<T>> success(HttpStatus httpStatusCode, String message, T data) {
        return ResponseEntity.status(httpStatusCode).body(new BaseResponse<>(true, message, data));
    }
}
