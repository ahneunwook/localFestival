package com.localfestival.festival.domain.festival.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "festival_region_stats")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class FestivalRegionStats {

    @Id
    private String region;

    @Column(name = "festival_count", nullable = false)
    private Integer festivalCount;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
