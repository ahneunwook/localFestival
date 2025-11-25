package com.localfestival.festival.domain.question.controller;

import com.localfestival.festival.domain.question.dto.request.QuestionRequestDto;
import com.localfestival.festival.domain.question.dto.response.QuestionDetailResponseDto;
import com.localfestival.festival.domain.question.dto.response.QuestionResponseDto;
import com.localfestival.festival.domain.question.dto.response.UserProfileResponse;
import com.localfestival.festival.domain.question.service.QuestionService;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.common.BaseResponse;
import com.localfestival.festival.global.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<BaseResponse<Long>> createQuestion(
            @CurrentUser User user,
            @RequestBody QuestionRequestDto dto){

        Long questionId = questionService.createQuestion(user, dto);

        return BaseResponse.success(HttpStatus.CREATED, "문의 작성을 완료하였습니다.", questionId);
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<QuestionResponseDto>>> getQuestionList(){
        List<QuestionResponseDto> dto = questionService.getQuestionList();

        return BaseResponse.success(HttpStatus.OK, "문의 전체 조회가 완료되었습니다.", dto);
    }

    @GetMapping("/{questionId}")
    public ResponseEntity<BaseResponse<QuestionDetailResponseDto>> getDetailQuestion(
            @PathVariable("questionId") Long questionId
    ){
        QuestionDetailResponseDto detailResponseDto = questionService.getDetailQuestion(questionId);

        return BaseResponse.success(HttpStatus.OK, "문의 조회가 완료되었습니다.", detailResponseDto);
    }

    @PutMapping("/{questionId}")
    public ResponseEntity<BaseResponse<Long>> updateQuestion(
            @CurrentUser User user,
            @PathVariable("questionId") Long questionId,
            @RequestBody QuestionRequestDto questionRequestDto
    ){
        Long question = questionService.updateDetailQuestion(user, questionId, questionRequestDto);

        return BaseResponse.success(HttpStatus.OK, "수정이 완료 되었습니다.", question);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<BaseResponse<Void>> deleteQuestion(
            @CurrentUser User user,
            @PathVariable("questionId") Long questionId
    ){
       questionService.deleteQuestion(user, questionId);

        return BaseResponse.success(HttpStatus.OK, "삭제 완료 되었습니다.", null);
    }

    @GetMapping("/users/me")
    public ResponseEntity<BaseResponse<UserProfileResponse>> getUsers(@CurrentUser User user){
        UserProfileResponse userProfile = UserProfileResponse.from(user);

        return BaseResponse.success(HttpStatus.OK, "유저 조회가 완료 되었습니다.", userProfile);
    }
}
