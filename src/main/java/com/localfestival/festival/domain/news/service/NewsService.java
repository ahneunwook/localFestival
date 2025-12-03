package com.localfestival.festival.domain.news.service;

import com.localfestival.festival.domain.news.dto.request.NewsCreateRequest;
import com.localfestival.festival.domain.news.dto.request.NewsUpdateRequest;
import com.localfestival.festival.domain.news.dto.response.NewsListResponse;
import com.localfestival.festival.domain.news.dto.response.NewsResponse;
import com.localfestival.festival.domain.news.entity.News;
import com.localfestival.festival.domain.news.repository.NewsRepository;
import com.localfestival.festival.global.common.PageResponse;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import com.localfestival.festival.global.sse.service.SseEmitterService;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NewsService {

	private final NewsRepository newsRepository;
	private final SseEmitterService sseEmitterService;

	// 공지사항 목록 조회 (페이징)
	public PageResponse<NewsListResponse> getNewsList(Pageable pageable) {
		Page<NewsListResponse> newsPage = newsRepository.findAllByOrderByImportantDescCreatedAtDesc(pageable)
				.map(NewsListResponse::from);
		return PageResponse.from(newsPage);
	}

	// 공지사항 상세 조회
	@Transactional
	public NewsResponse getNewsDetail(Long id) {
		News news = newsRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.NEWS_NOT_FOUND));

		// 조회수 증가
		news.increaseViews();

		return NewsResponse.from(news);
	}

	// 공지사항 생성
	@Transactional
	public NewsResponse createNews(NewsCreateRequest request) {
		News news = News.builder().title(request.title()).content(request.content()).important(request.important())
				.build();

		News savedNews = newsRepository.save(news);
		
        if (savedNews.getImportant()) {
            Map<String, Object> notificationData = new HashMap<>();
            notificationData.put("newsId", savedNews.getId());
            notificationData.put("title", savedNews.getTitle());
            notificationData.put("message", "새로운 중요 공지사항이 등록되었습니다.");
            
            sseEmitterService.sendToAll("important-news", notificationData);
        }
        
		return NewsResponse.from(savedNews);
	}

	// 공지사항 수정
	@Transactional
	public NewsResponse updateNews(Long id, NewsUpdateRequest request) {
		News news = newsRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.NEWS_NOT_FOUND));

		news.update(request.title(), request.content(), request.important());

		return NewsResponse.from(news);
	}

	// 공지사항 삭제
	@Transactional
	public void deleteNews(Long id) {
		if (!newsRepository.existsById(id)) {
			throw new CustomException(ErrorCode.NEWS_NOT_FOUND);
		}
		newsRepository.deleteById(id);
	}
}
