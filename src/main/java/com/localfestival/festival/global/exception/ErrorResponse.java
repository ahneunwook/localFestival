package com.localfestival.festival.global.exception;

import lombok.Builder;

@Builder
public record ErrorResponse(int status, String code, String message, String path) {
}
