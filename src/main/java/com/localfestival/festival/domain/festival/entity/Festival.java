package com.localfestival.festival.domain.festival.entity;

import com.localfestival.festival.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "festivals", indexes = {
    @Index(name = "idx_active_dates", columnList = "isActive, startDate, endDate"),
    @Index(name = "idx_active_category", columnList = "isActive, category"),
    @Index(name = "idx_active_region", columnList = "isActive, region"),
    @Index(name = "idx_title", columnList = "title"),
    @Index(name = "idx_last_synced", columnList = "lastSyncedAt"),
    @Index(name = "idx_event_status", columnList = "eventStatus"),
    @Index(name = "idx_view_count", columnList = "viewCount")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Festival extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 500)
    private String uniqueKey; // 축제명 + 시작일 조합 (중복 방지용)

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String address;

    @Column(length = 100)
    private String detailAddress;

    @Column(length = 50)
    private String region; // 지역 (서울, 부산 등)

    private LocalDate startDate;

    private LocalDate endDate;

    @Column(length = 50)
    private String category; // 음악, 문화, 예술, 음식 등

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String homepageUrl;

    @Column(length = 50)
    private String tel;

    private Double latitude; // 위도

    private Double longitude; // 경도

    @Column(length = 200)
    private String organizer; // 주최기관

    @Column(length = 200)
    private String host; // 주관기관

    @Column(length = 500)
    private String sponsor; // 후원사

    @Column(length = 200)
    private String venue; // 개최장소

    @Column(length = 1000)
    private String relatedInfo; // 관련정보

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true; // 활성화 상태

    @Column(length = 20)
    private String eventStatus; // SCHEDULED, ONGOING, ENDED
    
    @Column(nullable = false)
    @Builder.Default
    private Long viewCount = 0L; // 조회수

    // 외부 API 동기화 시간
    private LocalDate lastSyncedAt;

    // 비즈니스 로직
    public void updateFromApi(Festival apiData) {
        this.title = apiData.getTitle();
        this.description = apiData.getDescription();
        this.address = apiData.getAddress();
        this.region = apiData.getRegion();
        this.startDate = apiData.getStartDate();
        this.endDate = apiData.getEndDate();
        this.category = apiData.getCategory();
        this.imageUrl = apiData.getImageUrl();
        this.homepageUrl = apiData.getHomepageUrl();
        this.tel = apiData.getTel();
        this.latitude = apiData.getLatitude();
        this.longitude = apiData.getLongitude();
        this.organizer = apiData.getOrganizer();
        this.host = apiData.getHost();
        this.sponsor = apiData.getSponsor();
        this.venue = apiData.getVenue();
        this.relatedInfo = apiData.getRelatedInfo();
        this.lastSyncedAt = LocalDate.now();
    }

    public void updateEventStatus() {
        LocalDate now = LocalDate.now();
        if (startDate != null && endDate != null) {
            if (now.isBefore(startDate)) {
                this.eventStatus = "SCHEDULED";
            } else if (now.isAfter(endDate)) {
                this.eventStatus = "ENDED";
            } else {
                this.eventStatus = "ONGOING";
            }
        }
    }

    public void deactivate() {
        this.isActive = false;
    }

    public void activate() {
        this.isActive = true;
    }
    
    // 조회수 증가
    public void incrementViewCount() {
        this.viewCount++;
    }
}
