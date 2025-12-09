package com.localfestival.festival.domain.user.controller;

import com.localfestival.festival.domain.user.dto.request.LoginRequestDto;
import com.localfestival.festival.domain.user.dto.request.SignupRequestDto;
import com.localfestival.festival.domain.user.dto.response.LoginResponseDto;
import com.localfestival.festival.domain.user.dto.response.SignupResponseDto;
import com.localfestival.festival.domain.user.service.UserService;
import com.localfestival.festival.global.common.BaseResponse;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import com.localfestival.festival.global.jwt.JwtUtil;
import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;


@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<BaseResponse<SignupResponseDto>> signup(@Valid @RequestBody SignupRequestDto signupRequestDto){
        SignupResponseDto signup = userService.signup(signupRequestDto);

        return BaseResponse.success(HttpStatus.CREATED, "회원가입에 성공하였습니다.", signup);
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponseDto>> login(@RequestBody LoginRequestDto loginRequestDto, HttpServletResponse response){
        LoginResponseDto login = userService.login(loginRequestDto);

        setRefreshTokenCookie(response, login.refreshToken());

        return BaseResponse.success(HttpStatus.OK, "로그인에 성공하였습니다.", login);
    }

    @Operation(summary = "토큰 재발급", description = "Refresh Token으로 새로운 Access Token 발급")
    @PostMapping("/refresh")
    public ResponseEntity<BaseResponse<LoginResponseDto>> refresh(
            @CookieValue(value = "refreshToken", required = false) String refreshToken
    ) {

        LoginResponseDto refresh = userService.refresh(refreshToken);

        return BaseResponse.success(HttpStatus.OK, "리프레쉬 토근 발급에 성공하였습니다.", refresh);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken
    ) {

        userService.logout(refreshToken);

        // RefreshToken 쿠키 삭제
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)   // 로컬에서는 false (운영에서는 true)
                .path("/")
                .sameSite("Lax") // 로컬은 Lax (운영은 None)
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("로그아웃이 되었습니다.");
    }


    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        String cleanRefresh = jwtUtil.subStringToken(refreshToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", cleanRefresh)
                .httpOnly(true)           // JavaScript 접근 불가 (XSS 방지)
                .secure(false)              // HTTPS에서만 전송 (운영: true, 로컬: false)
                .path("/")                // 모든 경로에서 접근 가능
                .sameSite("Lax")       // CSRF 방지
                .maxAge(Duration.ofDays(7))  // 7일
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
