package com.localfestival.festival.domain.user.controller;

import com.localfestival.festival.domain.user.dto.request.LoginRequestDto;
import com.localfestival.festival.domain.user.dto.request.SignupRequestDto;
import com.localfestival.festival.domain.user.dto.response.LoginResponseDto;
import com.localfestival.festival.domain.user.dto.response.SignupResponseDto;
import com.localfestival.festival.domain.user.service.UserService;
import com.localfestival.festival.global.common.BaseResponse;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<BaseResponse<SignupResponseDto>> signup(@Valid @RequestBody SignupRequestDto signupRequestDto){
        SignupResponseDto signup = userService.signup(signupRequestDto);

        return BaseResponse.success(HttpStatus.CREATED, "회원가입에 성공하였습니다.", signup);
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponseDto>> login(@RequestBody LoginRequestDto loginRequestDto){
        LoginResponseDto login = userService.login(loginRequestDto);

        return BaseResponse.success(HttpStatus.OK, "로그인에 성공하였습니다.", login);
    }
}
