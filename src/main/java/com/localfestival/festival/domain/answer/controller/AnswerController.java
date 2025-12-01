package com.localfestival.festival.domain.answer.controller;

import com.localfestival.festival.domain.answer.dto.request.AnswerRequest;
import com.localfestival.festival.domain.answer.service.AnswerService;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.common.BaseResponse;
import com.localfestival.festival.global.security.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/questions/{questionId}/answer")
    public ResponseEntity<BaseResponse<Long>> createAnswer (
            @Valid
            @PathVariable("questionId") Long questionId,
            @RequestBody AnswerRequest answerRequest,
            @CurrentUser User user
    ){
        Long answerId = answerService.createAnswer(questionId, answerRequest, user);

        return BaseResponse.success(HttpStatus.CREATED, "답글 작성을 완료하였습니다.", answerId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/questions/{questionId}/answer/{answerId}")
    public ResponseEntity<BaseResponse<Long>> updateAnswer (
            @Valid
            @PathVariable("questionId") Long questionId,
            @PathVariable("answerId") Long answerId,
            @RequestBody AnswerRequest answerRequest,
            @CurrentUser User user
    ){
        Long answer = answerService.updateAnswer(questionId, answerId, answerRequest, user);

        return BaseResponse.success(HttpStatus.CREATED, "답글 수정을 완료하였습니다.", answer);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/questions/{questionId}/answer/{answerId}")
    public ResponseEntity<BaseResponse<Void>> deleteAnswer (
            @PathVariable("questionId") Long questionId,
            @PathVariable("answerId") Long answerId,
            @CurrentUser User user
    ){
        answerService.deleteAnswer(questionId, answerId, user);

        return BaseResponse.success(HttpStatus.CREATED, "답글 삭제를 완료하였습니다.", null);
    }
}
