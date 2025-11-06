package com.localfestival.festival.global.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {

    private final ErrorCode errorCode;
    private final String customMessage;

    public CustomException(ErrorCode errorCode){
        //super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.customMessage = errorCode.getMessage();
    }

    public CustomException(ErrorCode errorCode, String customMessage) {
        //super(customMessage);  // enum message 대신 custom message 사용
        this.errorCode = errorCode;
        this.customMessage = customMessage;
    }

    @Override
    public String getMessage() {
        return customMessage;
    }
}
