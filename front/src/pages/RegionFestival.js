import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';

const REGION_CONFIG = {
    "서울": { color: "#a8d8ea", icon: "🏙️", type: "metro" },
    "부산": { color: "#d4a5d8", icon: "🏖️", type: "metro" },
    "대구": { color: "#ffa07a", icon: "🎭", type: "metro" },
    "인천": { color: "#98d8c8", icon: "🌊", type: "metro" },
    "광주": { color: "#f6c667", icon: "🎨", type: "metro" },
    "대전": { color: "#c497d4", icon: "🔬", type: "metro" },
    "울산": { color: "#a8d8ea", icon: "🏭", type: "metro" },
    "세종": { color: "#d4a5d8", icon: "🏛️", type: "metro" },
    "경기": { color: "#ffa07a", icon: "🏘️", type: "province" },
    "강원": { color: "#98d8c8", icon: "⛰️", type: "province" },
    "충북": { color: "#f6c667", icon: "🌳", type: "province" },
    "충남": { color: "#c497d4", icon: "🌾", type: "province" },
    "전북": { color: "#a8d8ea", icon: "🍚", type: "province" },
    "전남": { color: "#d4a5d8", icon: "🌅", type: "province" },
    "경북": { color: "#ffa07a", icon: "🏯", type: "province" },
    "경남": { color: "#98d8c8", icon: "🌸", type: "province" },
    "제주": { color: "#f6c667", icon: "🍊", type: "province" }
};

export async function RegionPage() {

    const regionList = await festivalApi.getRegionCount();

    const regionData = regionList.map(r => ({
        name : r.region,
        count : r.count,
        ...REGION_CONFIG[r.region]
    }));

    // 광역시/특별시와 도를 분리
    const metros = regionData.filter(r => r.type === 'metro');
    const provinces = regionData.filter(r => r.type === 'province');

    return `
    ${createHeader('festivals')}
    
    <main class="region-page">
      <div class="region-header">
        <h1 class="page-title">🗺️ 지역별 축제</h1>
        <p class="page-subtitle">전국 각지의 다채로운 축제를 만나보세요</p>
      </div>

      <!-- 광역시/특별시 -->
      <section class="region-section">
        <h2 class="section-title">🏙️ 광역시 · 특별시</h2>
        <div class="region-grid">
          ${metros.map(region => `
            <a href="/festivals/regions?region=${encodeURIComponent(region.name)}"
             class="region-card metro" style="--region-color: ${region.color}">
              <div class="region-icon">${region.icon}</div>
              <div class="region-info">
                <div class="region-name">${region.name}</div>
                <div class="region-count">
                  <span class="count-number">${region.count}</span>
                  <span class="count-label">개 축제</span>
                </div>
              </div>
              <div class="arrow-icon">→</div>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- 도 -->
      <section class="region-section">
        <h2 class="section-title">🏞️ 도</h2>
        <div class="region-grid">
          ${provinces.map(region => `
            <a href="/festivals/regions?region=${encodeURIComponent(region.name)}"
                 class="region-card province" style="--region-color: ${region.color}">
              <div class="region-icon">${region.icon}</div>
              <div class="region-info">
                <div class="region-name">${region.name}</div>
                <div class="region-count">
                  <span class="count-number">${region.count}</span>
                  <span class="count-label">개 축제</span>
                </div>
              </div>
              <div class="arrow-icon">→</div>
            </a>
          `).join('')}
        </div>
      </section>
    </main>
  `;
}

// 이벤트 리스너는 이제 필요 없음 (a 태그로 처리)
export function setupRegionListeners() {
    // a 태그로 자동 처리되므로 빈 함수
}