package com.localfestival.festival.domain.user.dto.response;

public record LoginResponseDto(String accessToken, String refreshToken) {
    public static LoginResponseDto onlyAccess(String access) {
        return new LoginResponseDto(access, null);
    }

    public static LoginResponseDto both(String access, String refresh) {
        return new LoginResponseDto(access, refresh);
    }
}

