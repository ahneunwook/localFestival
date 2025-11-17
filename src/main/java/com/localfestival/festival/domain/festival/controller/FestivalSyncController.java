package com.localfestival.festival.domain.festival.controller;

import com.localfestival.festival.domain.festival.service.FestivalSyncService;
import com.localfestival.festival.global.common.BaseResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 축제 데이터 동기화 관리 컨트롤러
 * - 수동 동기화 트리거
 * - 상태 업데이트
 * 
 * 에러는 GlobalExceptionHandler에서 ErrorResponse로 자동 처리됨
 */
@Slf4j
@RestController
@RequestMapping("/admin/festivals")
@RequiredArgsConstructor
public class FestivalSyncController {

    private final FestivalSyncService festivalSyncService;

    // 축제 동기화
    @PostMapping("/sync")
    public ResponseEntity<BaseResponse<String>> manualSync() {
        log.info("Manual festival sync triggered");
        
        festivalSyncService.syncFestivals();
        
		return BaseResponse.success(HttpStatus.OK, "축제 데이터 동기화 완료.", null);
    }

    // 상태 업데이트
    @PostMapping("/update-status")
    public ResponseEntity<BaseResponse<String>> updateStatuses() {
        log.info("Manual festival status update triggered");
        
        festivalSyncService.updateFestivalStatuses();
        
		return BaseResponse.success(HttpStatus.OK, "축제 업데이트 완료.", null);
    }
}
