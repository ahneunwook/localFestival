package com.localfestival.festival.domain.question.service;

import com.localfestival.festival.domain.question.dto.request.QuestionRequestDto;
import com.localfestival.festival.domain.question.dto.response.QuestionDetailResponseDto;
import com.localfestival.festival.domain.question.dto.response.QuestionResponseDto;
import com.localfestival.festival.domain.question.entity.Question;
import com.localfestival.festival.domain.question.repository.QuestionRepository;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    @Transactional
    public Long createQuestion(User user, QuestionRequestDto dto) {

        Question question = Question.createQuestion(dto, user);

        questionRepository.save(question);

        return question.getId();
    }

    @Transactional(readOnly = true)
    public List<QuestionResponseDto> getQuestionList() {
        return questionRepository.findAllQuestions().stream()
                .map(QuestionResponseDto::toDto).toList();
    }

    @Transactional(readOnly = true)
    public QuestionDetailResponseDto getDetailQuestion(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        return QuestionDetailResponseDto.toQuestionDto(question);
    }
}
