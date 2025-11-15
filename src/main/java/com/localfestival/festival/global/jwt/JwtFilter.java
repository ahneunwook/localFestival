package com.localfestival.festival.global.jwt;

import com.localfestival.festival.domain.user.enums.Role;
import com.localfestival.festival.global.exception.CustomException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    /**
     * JWT 인증 필터
     * - 모든 요청에서 Authorization 헤더를 확인
     * - 유효한 JWT 토큰이면 SecurityContext에 Authentication 저장
     * - 잘못된 토큰이면 SecurityContext 초기화 후 다음 필터로 넘김
     *
     *  요청마다 단 1번만 실행됨
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException
    {
        String bearerToken = request.getHeader("Authorization");

        if (!StringUtils.hasText(bearerToken) || !bearerToken.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claimsToken = jwtUtil.parseToken(bearerToken);

            //사용자 정보 추출
            Long userId = Long.valueOf(claimsToken.getSubject());
            String userName = claimsToken.get("userName", String.class);
            String roleString = claimsToken.get("userRole", String.class);
            Role userRole = Role.valueOf(roleString);

            // CustomUserPrincipal 은 인증된 사용자 정보 객체
            CustomUserPrincipal customUserPrincipal = new CustomUserPrincipal(userId, userName, userRole);

            /**
             * UsernamePasswordAuthenticationToken 을 직접 생성하는 이유:
             * - JWT는 비밀번호 기반 인증이 아님
             * - 토큰이 유효하면 이미 인증된 사용자로 처리해야 함
             */
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            customUserPrincipal, null, List.of(new SimpleGrantedAuthority("ROLE_" + userRole)));

            // 현재 요청에 인증 정보 저장 → 이후 컨트롤러에서 @AuthenticationPrincipal 사용 가능
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (CustomException e) {
            log.warn("JWT 인증 실패: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
