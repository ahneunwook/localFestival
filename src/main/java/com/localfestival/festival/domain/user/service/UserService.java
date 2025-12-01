package com.localfestival.festival.domain.user.service;

import com.localfestival.festival.domain.user.dto.request.LoginRequestDto;
import com.localfestival.festival.domain.user.dto.request.SignupRequestDto;
import com.localfestival.festival.domain.user.dto.response.LoginResponseDto;
import com.localfestival.festival.domain.user.dto.response.SignupResponseDto;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.domain.user.repository.UserRepository;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import com.localfestival.festival.global.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    public SignupResponseDto signup(SignupRequestDto signupRequestDto) {

        if(userRepository.existsByEmail(signupRequestDto.getEmail())){
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        if (!signupRequestDto.getPassword().equals(signupRequestDto.getConfirmPassword())){
            throw new CustomException(ErrorCode.PASSWORD_NOT_MATCHED);
        }

        User user = User.createUser(signupRequestDto, passwordEncoder);

        userRepository.save(user);

        return SignupResponseDto.toDto(user);
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        User user = userRepository.findByEmail(loginRequestDto.email())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        passwordMatch(loginRequestDto.password(), user.getPassword());

        return generateToken(user);
    }

    // 토큰 발급 로직
    private LoginResponseDto generateToken(User user){
        String accessToken = jwtUtil.createAccessToken(user.getId(), user.getUserName(), user.getRole());
        String refreshToken = jwtUtil.createRefreshToken(user.getId());

        refreshTokenService.saveRefreshToken(user.getId(), jwtUtil.subStringToken(refreshToken));

        return LoginResponseDto.both(accessToken, refreshToken);
    }

    @Transactional(readOnly = true)
    public LoginResponseDto refresh(String refreshToken) {
        // 쿠키가 없거나 비어있으면 예외
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        // Refresh Token 검증
        if (!jwtUtil.validateToken(refreshToken)){
            throw new CustomException(ErrorCode.TOKEN_INVALID);
        }

        // Refresh Token 타입 확인
        if (!jwtUtil.isRefreshToken(refreshToken)) {
            throw new CustomException(ErrorCode.TOKEN_INVALID, "Refresh Token이 아닙니다.");
        }

        // userId 추출
        Long userId = jwtUtil.getUserIdFromToken(refreshToken);

        // Redis에 저장된 Refresh Token과 비교
        String storedToken = refreshTokenService.find(userId);
        String cleanToken = jwtUtil.subStringToken(refreshToken);

        if (storedToken == null || !storedToken.equals(cleanToken)) {
            throw new CustomException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 새로운 Access Token 발급
        String newAccessToken = jwtUtil.createAccessToken(
                user.getId(),
                user.getUserName(),
                user.getRole()
        );

        return LoginResponseDto.onlyAccess(newAccessToken);
    }

    // 비밀번호 검증 로직
    private void passwordMatch(String requestPassword, String currentPassword){
        if (!passwordEncoder.matches(requestPassword, currentPassword)){
            throw new CustomException(ErrorCode.PASSWORD_NOT_MATCHED);
        }
    }
}
