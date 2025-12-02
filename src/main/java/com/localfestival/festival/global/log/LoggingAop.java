package com.localfestival.festival.global.log;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Aspect
public class LoggingAop {

    @Around("execution(* com.localfestival.festival.domain..controller..*(..))")
    public Object logController(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
       // String traceId = MDC.get("traceId");

        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        // 파라미터 값 로깅
        Object[] args = joinPoint.getArgs();
        log.info("{}.{}() 호출 | params={}", className, methodName, args);

        try {
            Object result = joinPoint.proceed();

            long endTime = System.currentTimeMillis();
            log.info("{},{}() 성공 | 처리시간={}ms", className, methodName, (endTime - startTime));

            return result;
        } catch (Exception e) {
            long endTime = System.currentTimeMillis();

            log.error("{}.{}() 예외 발생 | 처리시간={}ms",
                    className, methodName, (endTime - startTime), e);

            throw e;
        }
    }
}
