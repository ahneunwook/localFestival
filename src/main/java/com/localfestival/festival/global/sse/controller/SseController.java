package com.localfestival.festival.global.sse.controller;

import com.localfestival.festival.global.jwt.CustomUserPrincipal;
import com.localfestival.festival.global.sse.service.SseEmitterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@RestController
@RequestMapping("/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseEmitterService sseEmitterService;

    /**
     * SSE 구독 엔드포인트
     * 클라이언트가 이 엔드포인트에 연결하면 실시간 알림을 받을 수 있음
     * 
     * @param userPrincipal 인증된 사용자 정보
     * @return SseEmitter 객체
     */
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@AuthenticationPrincipal CustomUserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();
        log.info("SSE 구독 요청: userId={}", userId);
        
        return sseEmitterService.createEmitter(userId);
    }
}