package com.localfestival.festival.domain.festival.scheduler;

import com.localfestival.festival.domain.festival.service.FestivalSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FestivalSyncScheduler {

    private final FestivalSyncService festivalSyncService;

    // 매일 오전 3시
    @Scheduled(cron = "0 0 3 * * *")
    public void scheduledSync() {
        log.info("=== Scheduled Festival Sync Started ===");
        try {
            festivalSyncService.syncFestivals();
            log.info("=== Scheduled Festival Sync Completed Successfully ===");
        } catch (Exception e) {
            log.error("=== Scheduled Festival Sync Failed ===", e);
        }
    }

    // 정각마다
    @Scheduled(cron = "0 0 * * * *")
    public void updateFestivalStatuses() {
        log.info("=== Updating Festival Statuses ===");
        try {
            festivalSyncService.updateFestivalStatuses();
            log.info("=== Festival Status Update Completed ===");
        } catch (Exception e) {
            log.error("=== Festival Status Update Failed ===", e);
        }
    }

    // 매주 일요일마다 동기화
    @Scheduled(cron = "0 0 0 * * SUN")
    public void weeklyFullSync() {
        log.info("=== Weekly Full Sync Started ===");
        try {
            festivalSyncService.syncFestivals();
            festivalSyncService.updateFestivalStatuses();
            log.info("=== Weekly Full Sync Completed Successfully ===");
        } catch (Exception e) {
            log.error("=== Weekly Full Sync Failed ===", e);
        }
    }
}
