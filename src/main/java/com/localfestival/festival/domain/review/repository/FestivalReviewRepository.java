package com.localfestival.festival.domain.review.repository;

import com.localfestival.festival.domain.festival.dto.response.FestivalResponse;
import com.localfestival.festival.domain.festival.entity.QFestival;
import com.localfestival.festival.domain.review.dto.response.ReviewResponseDto;
import com.localfestival.festival.domain.review.entity.Review;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.localfestival.festival.domain.festival.entity.QFestival.festival;
import static com.localfestival.festival.domain.review.entity.QReview.review;
import static com.localfestival.festival.domain.user.entity.QUser.user;

@Repository
@RequiredArgsConstructor
public class FestivalReviewRepository {

    private final JPAQueryFactory query;

    public Page<Review> findReviewsByRating(Integer rating, Pageable pageable) {
        BooleanBuilder builder = new BooleanBuilder();
        if (rating != null){
            builder.and(review.rating.eq(rating));
        }

        List<Review> content = query
                .selectFrom(review)
                .leftJoin(review.festival, festival).fetchJoin()
                .leftJoin(review.user, user).fetchJoin()
                .where(builder)
                .orderBy(review.modifiedAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        JPAQuery<Long> countQuery = query
                .select(review.count())
                .from(review)
                .where(builder);

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }
}
