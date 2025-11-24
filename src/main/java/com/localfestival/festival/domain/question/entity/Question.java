package com.localfestival.festival.domain.question.entity;

import com.localfestival.festival.domain.answer.entity.Answer;
import com.localfestival.festival.domain.question.dto.request.QuestionRequestDto;
import com.localfestival.festival.domain.question.enums.QuestionCategory;
import com.localfestival.festival.domain.question.enums.QuestionStatus;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "questions")
@Getter
public class Question extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Enumerated(EnumType.STRING)
    @Column(name = "question_category", nullable = false, length = 30)
    private QuestionCategory category;

    @Column(nullable = false, length = 30)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionStatus status = QuestionStatus.PENDING;

    @OneToOne(mappedBy = "question", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private Answer answer;

    @Builder
    private Question(User author, QuestionCategory category, String title, String content, QuestionStatus status){
        this.author = author;
        this.category = category;
        this.title = title;
        this.content = content;
        this.status = status;
    }

    public static Question createQuestion(QuestionRequestDto questionResquestDto, User user){
        return Question.builder()
                .author(user)
                .category(QuestionCategory.from(questionResquestDto.getCategory()))
                .title(questionResquestDto.getTitle())
                .content(questionResquestDto.getContent())
                .status(QuestionStatus.PENDING)
                .build();
    }

    public void updateStatus(QuestionStatus status) {
        if (this.status == status){
            return;
        }
        this.status = status;
    }

    // 권한 검사 : 현재 유저가 게시글 작성자인지 확인
    public boolean isAuthor(Long userId){
        return this.author.getId().equals(userId);
    }

    public void updateQuestion(QuestionCategory category, String title, String content){
        this.category = category;
        this.title = title;
        this.content = content;
    }

}
