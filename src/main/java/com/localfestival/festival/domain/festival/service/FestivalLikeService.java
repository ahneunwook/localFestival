package com.localfestival.festival.domain.festival.service;

import com.localfestival.festival.domain.festival.entity.Festival;
import com.localfestival.festival.domain.festival.entity.FestivalLike;
import com.localfestival.festival.domain.festival.repository.FestivalLikeRepository;
import com.localfestival.festival.domain.festival.repository.FestivalRepository;
import com.localfestival.festival.domain.festival.dto.response.FestivalLikeResponse;
import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.domain.user.repository.UserRepository;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FestivalLikeService {

    private final FestivalLikeRepository festivalLikeRepository;
    private final FestivalRepository festivalRepository;
    private final UserRepository userRepository;

    /**
     * 좋아요 토글 (추가/취소)
     */
    @Transactional
    public FestivalLikeResponse toggleLike(Long festivalId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new CustomException(ErrorCode.FESTIVAL_NOT_FOUND));

        // 이미 좋아요를 눌렀는지 확인
        boolean isLiked = festivalLikeRepository.existsByUserAndFestival(user, festival);

        if (isLiked) {
            // 좋아요 취소
            FestivalLike festivalLike = festivalLikeRepository.findByUserAndFestival(user, festival)
                    .orElseThrow(() -> new CustomException(ErrorCode.LIKE_NOT_FOUND));
            festivalLikeRepository.delete(festivalLike);
        } else {
            // 좋아요 추가
            FestivalLike festivalLike = FestivalLike.create(user, festival);
            festivalLikeRepository.save(festivalLike);
        }

        // 최신 좋아요 정보 반환
        long likeCount = festivalLikeRepository.countByFestival(festival);
        boolean newIsLiked = !isLiked;

        return FestivalLikeResponse.of(festivalId, likeCount, newIsLiked);
    }

    /**
     * 축제의 좋아요 정보 조회
     */
    public FestivalLikeResponse getLikeInfo(Long festivalId, Long userId) {
        Festival festival = festivalRepository.findById(festivalId)
                .orElseThrow(() -> new CustomException(ErrorCode.FESTIVAL_NOT_FOUND));

        long likeCount = festivalLikeRepository.countByFestival(festival);

        boolean isLiked = false;
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
            isLiked = festivalLikeRepository.existsByUserAndFestival(user, festival);
        }

        return FestivalLikeResponse.of(festivalId, likeCount, isLiked);
    }
}
