package com.localfestival.festival.global.jwt;

import com.localfestival.festival.domain.user.enums.Role;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Component
public class JwtUtil {

    private final SecretKey secretKey;

    private static final String BEARER_PREFIX = "Bearer ";
    private static final long ACCESS_TOKEN_TIME = 15 * 60 * 1000L; // jwt 토큰 시간

    /**
     * 서버에 등록한 jwt 키를 base64로 디코딩 후 HMAC Key 로 만드는 과정
     * 서명을 하기 위한 코드
     *
     * @param secretKey
     */
    public JwtUtil(@Value("${jwt.secret.key}") String secretKey) {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     *  Access Token 생성
     * subject : userId
     * jti     : JWT 고유 식별자
     * userName, userRole : 사용자 정보
     * type    : access
     */
    public String createAccessToken(Long userId, String userName, Role role){
        Date date = new Date();
        String jti = UUID.randomUUID().toString();

        return BEARER_PREFIX +
                Jwts.builder()
                    .subject(String.valueOf(userId))
                    .id(jti)
                    .claim("userName", userName)
                    .claim("userRole", role.name())
                    .claim("type", "access")
                    .expiration(new Date(date.getTime() + ACCESS_TOKEN_TIME))
                    .issuedAt(date)
                    .signWith(secretKey)
                    .compact();
    }

    /**
     * Authorization 헤더에서 "Bearer " 제거 후 실제 JWT 값만 반환한다.
     */
    public String subStringToken(String bearerToken){
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)){
            return bearerToken.substring(7);
        }

        throw new CustomException(ErrorCode.SERVER_EXCEPTION_JWT);
    }

    /**
     * 토큰 검증 & Claims 파싱
     */
    public Claims parseToken(String bearerToken){

        String token = subStringToken(bearerToken);

        try{
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e){
            log.warn("토큰이 만료 되었습니다. : {}", e.getMessage());
            throw new CustomException(ErrorCode.TOKEN_EXPIRED);
        } catch (SecurityException | MalformedJwtException | UnsupportedJwtException e) {
            log.warn("잘못된 형식의 토큰입니다.: {}", e.getMessage());
            throw new CustomException(ErrorCode.TOKEN_INVALID);
        } catch (IllegalArgumentException e) {
            log.warn("토큰 정보가 비어있습니다.: {}", e.getMessage());
            throw new CustomException(ErrorCode.TOKEN_EMPTY);
        } catch (JwtException e) {
            log.error("지원하지 않는 토큰입니다.: {}", e.getMessage());
            throw new CustomException(ErrorCode.SERVER_EXCEPTION_JWT, "지원하지 않는 토큰입니다.");
        }
    }
    
    /**
     * Query Parameter나 Cookie에서 온 순수 토큰 파싱
     * "Bearer " 접두사가 없는 토큰을 직접 파싱
     * 
     * @param token 순수 JWT 토큰 (Bearer 접두사 없음)
     * @return Claims 객체
     */
    public Claims parseRawToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            log.warn("토큰이 만료 되었습니다. : {}", e.getMessage());
            throw new CustomException(ErrorCode.TOKEN_EXPIRED);
        } catch (SecurityException | MalformedJwtException | UnsupportedJwtException e) {
            log.warn("잘못된 형식의 토큰입니다.: {}", e.getMessage());
            throw new CustomException(ErrorCode.TOKEN_INVALID);
        } catch (IllegalArgumentException e) {
            log.warn("토큰 정보가 비어있습니다.: {}", e.getMessage());
            throw new CustomException(ErrorCode.TOKEN_EMPTY);
        } catch (JwtException e) {
            log.error("지원하지 않는 토큰입니다.: {}", e.getMessage());
            throw new CustomException(ErrorCode.SERVER_EXCEPTION_JWT, "지원하지 않는 토큰입니다.");
        }
    }

}
