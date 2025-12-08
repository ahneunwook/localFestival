package com.localfestival.festival.domain.festival.repository;

import com.localfestival.festival.domain.festival.dto.response.FestivalResponse;
import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.festival.entity.QFestival;
import com.localfestival.festival.global.common.PageResponse;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

import static com.localfestival.festival.domain.festival.entity.QFestival.festival;

@Repository
@RequiredArgsConstructor
public class FestivalRegionRepository {

    private final JPAQueryFactory query;

    public Page<FestivalResponse> findByFilters(
            String region, String status, String category, Pageable pageable
    ) {
        BooleanBuilder filter = booleanFilter(region, status, category, festival);

        List<FestivalResponse> content = query
                .select(Projections.constructor(FestivalResponse.class,
                        festival.id,
                        festival.title,
                        festival.description,
                        festival.startDate,
                        festival.endDate,
                        festival.address,
                        festival.detailAddress,
                        festival.region,
                        festival.category,
                        festival.venue,
                        festival.organizer,
                        festival.host,
                        festival.sponsor,
                        festival.homepageUrl,
                        festival.imageUrl,
                        festival.tel,
                        festival.relatedInfo,
                        festival.latitude,
                        festival.longitude,
                        festival.eventStatus
                ))
                .from(festival)
                .where(filter)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(festival.startDate.desc())
                .fetch();

        long total = query
                .select(festival.count())
                .from(festival)
                .where(filter)
                .fetchOne();

        return new PageImpl<>(content, pageable, total);
    }

    private BooleanBuilder booleanFilter(String region, String status, String category, QFestival festival){
        BooleanBuilder builder = new BooleanBuilder();
        LocalDate today = LocalDate.now();

        builder.and(festival.region.eq(region));

        builder.and(
                festival.endDate.gt(today)
                        .or(festival.endDate.eq(today))
        );

        if (category != null && !category.equals("전체")){
            builder.and(festival.category.eq(category));
        }

        if (status != null && !status.equals("all")) {
            switch (status) {
                case "ongoing" :
                    builder.and(festival.startDate.loe(today)
                            .and(festival.endDate.goe(today)));
                    break;

                case "upcoming" :
                    builder.and(festival.startDate.gt(today));
                    break;
            }
        }

        return builder;
    }
}
