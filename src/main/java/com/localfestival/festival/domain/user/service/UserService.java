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
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

        return new LoginResponseDto(accessToken);
    }

    // 비밀번호 검증 로직
    private void passwordMatch(String requestPassword, String currentPassword){
        if (!passwordEncoder.matches(requestPassword, currentPassword)){
            throw new CustomException(ErrorCode.PASSWORD_NOT_MATCHED);
        }
    }
}
