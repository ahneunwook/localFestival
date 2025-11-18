package com.localfestival.festival.global.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.localfestival.festival.global.exception.ErrorResponse;
import jakarta.persistence.Column;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper mapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {

        log.warn("403 Forbidden - 접근 권한 없음. URI: {}, message: {}", request.getRequestURI(), accessDeniedException.getMessage());


        ErrorResponse error = ErrorResponse.builder()
                .status(HttpServletResponse.SC_FORBIDDEN)
                .code("FORBIDDEN")
                .message("접근 권한이 없습니다.")
                .path(request.getRequestURI())
                .build();

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(mapper.writeValueAsString(error));


    }
}
