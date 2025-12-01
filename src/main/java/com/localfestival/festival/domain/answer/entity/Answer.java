package com.localfestival.festival.domain.answer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.localfestival.festival.domain.answer.dto.request.AnswerRequest;
import com.localfestival.festival.domain.question.entity.Question;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "answer")
public class Answer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Builder
    private Answer(String content, Question question, User admin){
        this.content = content;
        this.question = question;
        this.admin = admin;
    }

    public static Answer answer(AnswerRequest answerRequest, Question question, User admin){
        return Answer.builder()
                .content(answerRequest.getContent())
                .question(question)
                .admin(admin)
                .build();
    }

    public void updateAnswer(String content, User admin){
        this.content = content;
        this.admin = admin;
    }
}
