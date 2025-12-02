package com.localfestival.festival.global.log;

import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class LogTraceFilter implements Filter {

    private static final String TRACE_ID_KEY = "traceId";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // 고유 traceId 생성
        String traceId = UUID.randomUUID().toString().substring(0, 8);

        try {
            // MDC에 Trace Id 저장
            MDC.put(TRACE_ID_KEY, traceId);

            HttpServletResponse res = (HttpServletResponse) response;
            res.setHeader("X-Trace-Id", traceId);

            chain.doFilter(request, response);
        } finally {
            // 요청이 끝나면 MDC에서 ID제거 -> 스레드 재사용 시 이전 요청의 ID가 남는 것을 방지
            MDC.remove(TRACE_ID_KEY);
        }
    }
}
