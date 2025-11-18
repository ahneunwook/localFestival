package com.localfestival.festival.global.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.localfestival.festival.global.exception.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper mapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

        log.warn("401 UNAUTHORIZED - 인증 실패 URI: {}, message: {}", request.getRequestURI(), authException.getMessage());

        ErrorResponse error = ErrorResponse.builder()
                .status(HttpServletResponse.SC_UNAUTHORIZED)
                .code("UNAUTHORIZED")
                .message("인증에 실패 하였습니다.")
                .path(request.getRequestURI())
                .build();

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(mapper.writeValueAsString(error));

    }
}
