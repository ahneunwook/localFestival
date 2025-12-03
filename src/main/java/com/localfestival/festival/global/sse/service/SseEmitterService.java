package com.localfestival.festival.global.sse.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class SseEmitterService {
    
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    /**
     * SSE 연결 생성
     * 
     * @param userId 사용자 ID
     * @return SseEmitter 객체
     */
    public SseEmitter createEmitter(Long userId) {
        // 타임아웃 1시간 설정
        SseEmitter emitter = new SseEmitter(60 * 60 * 1000L);
        
        // Map에 저장
        emitters.put(userId, emitter);
        log.info("SSE 연결 생성: userId={}", userId);
        
        // 연결 종료 시 정리
        emitter.onCompletion(() -> {
            emitters.remove(userId);
            log.info("SSE 연결 정상 종료: userId={}", userId);
        });
        
        emitter.onTimeout(() -> {
            emitters.remove(userId);
            log.info("SSE 연결 타임아웃: userId={}", userId);
        });
        
        // 에러 타입에 따라 로그 레벨 분리
        emitter.onError((e) -> {
            emitters.remove(userId);
            
            // 클라이언트가 연결을 끊은 경우 (정상 동작)
            if (e instanceof AsyncRequestNotUsableException) {
                log.debug("SSE 클라이언트 연결 종료: userId={}", userId);
            } 
            // IOException도 대부분 정상적인 연결 종료
            else if (e instanceof IOException) {
                log.debug("SSE 연결 종료 : userId={}, message={}", userId, e.getMessage());
            }
            // 진짜 예외적인 에러만 ERROR 레벨로
            else {
                log.error("SSE 연결 에러: userId={}, error={}", userId, e.getMessage(), e);
            }
        });
        
        // 연결 직후 초기 데이터 전송 (연결 확인용)
        try {
            emitter.send(SseEmitter.event()
                .name("connected")
                .data("SSE 연결 성공"));
        } catch (IOException e) {
            emitters.remove(userId);
            log.error("초기 데이터 전송 실패: userId={}", userId, e);
        }
        
        return emitter;
    }

    /**
     * 모든 연결된 사용자에게 알림 전송
     * 
     * @param eventName 이벤트 이름 (예: "important-news")
     * @param data 전송할 데이터
     */
    public void sendToAll(String eventName, Object data) {
        List<Long> deadEmitters = new ArrayList<>();
        
        emitters.forEach((userId, emitter) -> {
            try {
                emitter.send(SseEmitter.event()
                    .name(eventName)
                    .data(data));
                log.info("알림 전송 성공: userId={}, event={}", userId, eventName);
            } catch (IOException e) {
                deadEmitters.add(userId);
                log.debug("알림 전송 실패 (연결 종료됨): userId={}, event={}", userId, eventName);
            }
        });
        
        // 죽은 연결 정리
        deadEmitters.forEach(emitters::remove);
        
        if (!deadEmitters.isEmpty()) {
            log.info("정리된 연결 수: {}, 남은 연결 수: {}", deadEmitters.size(), emitters.size());
        }
    }

    /**
     * 특정 사용자에게만 알림 전송
     * 
     * @param userId 사용자 ID
     * @param eventName 이벤트 이름
     * @param data 전송할 데이터
     */
    public void sendToUser(Long userId, String eventName, Object data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                    .name(eventName)
                    .data(data));
                log.info("개별 알림 전송 성공: userId={}, event={}", userId, eventName);
            } catch (IOException e) {
                emitters.remove(userId);
                log.debug("개별 알림 전송 실패 (연결 종료됨): userId={}, event={}", userId, eventName);
            }
        } else {
            log.warn("SSE 연결을 찾을 수 없음: userId={}", userId);
        }
    }

    /**
     * 현재 연결된 사용자 수 조회 (모니터링)
     * 
     * @return 연결된 사용자 수
     */
    public int getConnectedUserCount() {
        return emitters.size();
    }
}