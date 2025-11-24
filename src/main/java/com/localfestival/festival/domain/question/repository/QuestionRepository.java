package com.localfestival.festival.domain.question.repository;

import com.localfestival.festival.domain.question.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q FROM Question q join fetch q.author")
    List<Question> findAllQuestions();

    Optional<Question> findByAuthorId(Long userId);
}
