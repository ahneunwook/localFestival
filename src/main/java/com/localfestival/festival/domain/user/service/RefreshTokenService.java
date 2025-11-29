package com.localfestival.festival.domain.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final String PREFIX = "refresh:";
    private static final long REFRESH_TTL = Duration.ofDays(7).toMillis();

    // 로그인할 때 Redis에 Refresh Token 저장
    public void saveRefreshToken(Long userId, String refreshToken) {
        redisTemplate.opsForValue().set(
                PREFIX + userId,
                refreshToken,
                REFRESH_TTL,
                TimeUnit.MILLISECONDS
        );
    }

    // 재발급 요청이 왔을 때 저장된 Refresh Token 조회
    public String find(Long userId) {
        return redisTemplate.opsForValue().get(PREFIX + userId);
    }

    // 로그아웃 시 Refresh Token 삭제
    public void delete(Long userId) {
        redisTemplate.delete(PREFIX + userId);
    }

}
