package com.localfestival.festival.global.exception;


import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Locale;
import java.util.Objects;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    // 커스텀 예외 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException e, HttpServletRequest request) {
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(ErrorResponse.builder()
                        .status(errorCode.getHttpStatus().value())
                        .code(errorCode.name())
                        .message(e.getMessage())
                        .path(request.getRequestURI())
                        .build());
    }

    // @Valid 유효성 예외
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e,
                                                                               HttpServletRequest request) {
        String message = messageSource.getMessage(Objects.requireNonNull(e.getFieldError()), Locale.KOREA);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .code("INVALID_ARGUMENT")
                        .message(message)
                        .path(request.getRequestURI())
                        .build());
    }

    // @PathVariable 타입 불일치
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e,
                                                                                   HttpServletRequest request) {
        String message = String.format("'%s' 파라미터의 값 '%s'이(가) 올바르지 않습니다. %s 타입이어야 합니다.",
                e.getName(), e.getValue(), e.getRequiredType().getSimpleName());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .code("TYPE_MISMATCH")
                        .message(message)
                        .path(request.getRequestURI())
                        .build());
    }

    // 필수 RequestParam 누락
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestParameterException(MissingServletRequestParameterException e,
                                                                                       HttpServletRequest request) {
        String message = String.format("필수 파라미터 '%s'이(가) 누락되었습니다.", e.getParameterName());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .code("MISSING_PARAMETER")
                        .message(message)
                        .path(request.getRequestURI())
                        .build());
    }

    // RequestParam 변환 실패 (BindException)
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ErrorResponse> handleBindException(BindException e, HttpServletRequest request) {
        String message = e.getBindingResult().getAllErrors().stream()
                .map(error -> {
                    if (error instanceof FieldError fieldError) {
                        return String.format("'%s' 필드의 값이 올바르지 않습니다.", fieldError.getField());
                    }
                    return error.getDefaultMessage();
                })
                .findFirst()
                .orElse("요청 파라미터가 올바르지 않습니다.");

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.BAD_REQUEST.value())
                        .code("BIND_ERROR")
                        .message(message)
                        .path(request.getRequestURI())
                        .build());
    }

    // HTTP 메서드 오류
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e,
                                                                                      HttpServletRequest request) {
        String message = String.format("'%s' 메서드는 지원하지 않습니다. 지원하는 메서드: %s",
                e.getMethod(), String.join(", ", Objects.requireNonNull(e.getSupportedMethods())));
        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.METHOD_NOT_ALLOWED.value())
                        .code("METHOD_NOT_ALLOWED")
                        .message(message)
                        .path(request.getRequestURI())
                        .build());
    }

    // Content-Type 오류
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException e,
                                                                                  HttpServletRequest request) {
        String message = String.format("지원하지 않는 Content-Type입니다. 지원하는 타입: %s",
                e.getSupportedMediaTypes());
        return ResponseEntity
                .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value())
                        .code("UNSUPPORTED_MEDIA_TYPE")
                        .message(message)
                        .path(request.getRequestURI())
                        .build());
    }

    // 그 외 모든 예외 (안정망)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e, HttpServletRequest request) {
        e.printStackTrace(); // 로그 출력
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.builder()
                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .code("INTERNAL_SERVER_ERROR")
                        .message("서버 내부 오류가 발생했습니다.")
                        .path(request.getRequestURI())
                        .build());
    }
    
    // SSE 클라이언트 연결 종료
    @ExceptionHandler(AsyncRequestNotUsableException.class)
    public void handleAsyncRequestNotUsable(AsyncRequestNotUsableException e, HttpServletRequest request) {
    }
}