package com.localfestival.festival.global.log;

import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.jwt.CustomUserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAop {

    private final AuditLogService auditLogService;

    @Around("execution(* com.localfestival.festival.domain..controller..*(..))")
    public Object auditLog(ProceedingJoinPoint joinPoint) throws Throwable{

        // 요청 컨텍스트가 없는 경우 방어 코드
        if (RequestContextHolder.getRequestAttributes() == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();

        long start = System.currentTimeMillis();
        Object result = null;
        Exception thrownException = null;

        try {
            result = joinPoint.proceed();
            return result;
        } catch (Exception e) {
            thrownException = e;
            throw e;
        } finally {
            long duration = System.currentTimeMillis() - start;
            String traceId = MDC.get("traceId");
            AuditLog auditLog = AuditLog.builder()
                    .traceId(traceId)
                    .method(req.getMethod())
                    .uri(req.getRequestURI())
                    .httpStatus(thrownException == null ? "200" : "500")
                    .userAgent(req.getHeader("User-Agent"))
                    .ip(req.getRemoteAddr())
                    .userId(getUserId())
                    .durationMs(duration)
                    .build();

            auditLogService.auditSave(auditLog);

            log.info("[AUDIT] {} {} {}ms", req.getMethod(), req.getRequestURI(), duration);
        }
    }

    private Long getUserId(){
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")){
                return null;
            }

            if (auth.getPrincipal() instanceof CustomUserPrincipal principal) {
                return principal.getUser().getId();
            }

            User user = (User) auth.getPrincipal();

            return user.getId();
        } catch (Exception e) {
            return null;
        }
    }
}
