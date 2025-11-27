package com.localfestival.festival.domain.answer.service;

import com.localfestival.festival.domain.answer.dto.request.AnswerRequest;
import com.localfestival.festival.domain.answer.entity.Answer;
import com.localfestival.festival.domain.answer.repository.AnswerRepository;
import com.localfestival.festival.domain.question.entity.Question;
import com.localfestival.festival.domain.question.enums.QuestionStatus;
import com.localfestival.festival.domain.question.repository.QuestionRepository;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    @Transactional
    public Long createAnswer(Long questionId, AnswerRequest answerRequest, User user) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        Answer answer = Answer.answer(answerRequest, question, user);

        answerRepository.save(answer);
        question.updateStatus(QuestionStatus.ANSWERED);

        return answer.getId();
    }

    @Transactional
    public Long updateAnswer(Long questionId, Long answerId, AnswerRequest answerRequest, User user) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

        if (!answer.getQuestion().getId().equals(questionId)){
            throw new CustomException(ErrorCode.INVALID_ANSWER_RELATION);
        }

        answer.updateAnswer(answerRequest.getContent(), user);

        return answer.getId();
    }

    @Transactional
    public void deleteAnswer(Long questionId, Long answerId, User user) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new CustomException(ErrorCode.QUESTION_NOT_FOUND));

        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new CustomException(ErrorCode.ANSWER_NOT_FOUND));

        if (!answer.getQuestion().getId().equals(questionId)){
            throw new CustomException(ErrorCode.INVALID_ANSWER_RELATION);
        }

        answerRepository.delete(answer);

        Long count = answerRepository.countByQuestionId(question.getId());

        if (count == 0){
            question.updateStatus(QuestionStatus.PENDING);
        }
    }
}
