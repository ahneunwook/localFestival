package com.localfestival.festival.domain.news.controller;

import com.localfestival.festival.domain.news.dto.request.NewsCreateRequest;
import com.localfestival.festival.domain.news.dto.request.NewsUpdateRequest;
import com.localfestival.festival.domain.news.dto.response.NewsListResponse;
import com.localfestival.festival.domain.news.dto.response.NewsResponse;
import com.localfestival.festival.domain.news.service.NewsService;
import com.localfestival.festival.global.common.BaseResponse;
import com.localfestival.festival.global.common.PageResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    // 공지사항 목록 조회
    @GetMapping
    public ResponseEntity<BaseResponse<PageResponse<NewsListResponse>>> getNewsList(
            @PageableDefault(size = 10) Pageable pageable
    ) {
    	PageResponse<NewsListResponse> newsList = newsService.getNewsList(pageable);
        return BaseResponse.success(HttpStatus.OK, "공지사항 목록 조회 성공", newsList);
    }

    // 공지사항 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<NewsResponse>> getNewsDetail(@PathVariable("id") Long id) {
        NewsResponse news = newsService.getNewsDetail(id);
        return BaseResponse.success(HttpStatus.OK, "공지사항 상세 조회 성공", news);
    }

    // 공지사항 생성
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<BaseResponse<NewsResponse>> createNews(
            @Valid @RequestBody NewsCreateRequest request
    ) {
        NewsResponse news = newsService.createNews(request);
        return BaseResponse.success(HttpStatus.CREATED, "공지사항 생성 성공", news);
    }

    // 공지사항 수정
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<BaseResponse<NewsResponse>> updateNews(
            @PathVariable("id") Long id,
            @Valid @RequestBody NewsUpdateRequest request
    ) {
        NewsResponse news = newsService.updateNews(id, request);
        return BaseResponse.success(HttpStatus.OK, "공지사항 수정 성공", news);
    }

    // 공지사항 삭제
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteNews(@PathVariable("id") Long id) {
        newsService.deleteNews(id);
        return BaseResponse.success(HttpStatus.OK, "공지사항 삭제 성공", null);
    }
}
