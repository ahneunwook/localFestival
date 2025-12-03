package com.localfestival.festival.global.jwt;

import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.domain.user.enums.Role;
import com.localfestival.festival.domain.user.repository.UserRepository;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
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
    private final UserRepository userRepository;

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
        // Authorization 헤더에서 토큰 추출
        String bearerToken = request.getHeader("Authorization");
        Claims claimsToken = null;

        // 헤더에 토큰이 있는 경우 (일반 API 요청)
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            try {
            	log.info("=== 헤더 인증 시도");
                claimsToken = jwtUtil.parseToken(bearerToken);
            } catch (CustomException e) {
                log.warn("JWT 인증 실패 (Header): {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }
        // SSE 경로인 경우, Query Parameter도 확인
        else if (request.getRequestURI().startsWith("/api/sse/")) {
            String token = request.getParameter("token");
            if (StringUtils.hasText(token)) {
                try {
                    claimsToken = jwtUtil.parseRawToken(token);  // ⭐ Bearer 없는 순수 토큰 파싱
                    log.debug("SSE 경로: Query Parameter에서 토큰 인증 성공");
                } catch (CustomException e) {
                    log.warn("JWT 인증 실패 (Query Parameter): {}", e.getMessage());
                    SecurityContextHolder.clearContext();
                }
            }
        }

        // 토큰 파싱에 성공한 경우 인증 처리
        if (claimsToken != null) {
            try {
                // 사용자 정보 추출
                Long userId = Long.valueOf(claimsToken.getSubject());
                String userName = claimsToken.get("userName", String.class);
                String roleString = claimsToken.get("userRole", String.class);
                Role userRole = Role.valueOf(roleString);

                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

                // CustomUserPrincipal 은 인증된 사용자 정보 객체
                CustomUserPrincipal customUserPrincipal = new CustomUserPrincipal(user);

                /**
                 * UsernamePasswordAuthenticationToken 을 직접 생성하는 이유:
                 * - JWT는 비밀번호 기반 인증이 아님
                 * - 토큰이 유효하면 이미 인증된 사용자로 처리해야 함
                 */
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        customUserPrincipal, null, List.of(new SimpleGrantedAuthority("ROLE_" + userRole)));

                // 현재 요청에 인증 정보 저장 → 이후 컨트롤러에서 @AuthenticationPrincipal 사용 가능
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("JWT 인증 성공: userId={}, userName={}", userId, userName);

            } catch (CustomException e) {
                log.warn("사용자 정보 조회 실패: {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
