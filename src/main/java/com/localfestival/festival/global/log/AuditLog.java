package com.localfestival.festival.global.log;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String traceId;
    private String method;
    private String uri;
    private String httpStatus;
    private String userAgent;
    private String ipAddress;
    private Long userId;
    private long durationMs;

    private LocalDateTime createdAt;

    @Builder
    public AuditLog(String traceId, String method, String uri, String httpStatus,
                    String userAgent, String ip, Long userId, long durationMs) {
        this.traceId = traceId;
        this.method = method;
        this.uri = uri;
        this.httpStatus = httpStatus;
        this.userAgent = userAgent;
        this.ipAddress = ip;
        this.userId = userId;
        this.durationMs = durationMs;
        this.createdAt = LocalDateTime.now();
    }
}
