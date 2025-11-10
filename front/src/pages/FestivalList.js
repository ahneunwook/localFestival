import { createHeader } from '../components/header.js';

export function FestivalListPage() {
  return `
    ${createHeader('list')}

    <main class="main-container">
      <div class="page-header">
        <h1 class="page-title">축제 목록</h1>
        <p class="page-subtitle">전국의 다양한 축제를 만나보세요</p>
      </div>

      <div class="filter-section">
        <div class="filter-tabs">
          <button class="filter-tab active">전체</button>
          <button class="filter-tab">음악</button>
          <button class="filter-tab">문화</button>
          <button class="filter-tab">예술</button>
          <button class="filter-tab">음식</button>
          <button class="filter-tab">전통</button>
          <button class="filter-tab">지역축제</button>
        </div>
      </div>

      <div class="festival-grid">
        <div class="festival-card">
          <div class="festival-image">🎵</div>
          <div class="festival-info">
            <span class="festival-category">음악</span>
            <h3 class="festival-title">서울 재즈 페스티벌</h3>
            <p class="festival-date">📅 2025.05.15 - 2025.05.17</p>
            <p class="festival-location">📍 서울 올림픽공원</p>
          </div>
        </div>

        <div class="festival-card">
          <div class="festival-image">🎨</div>
          <div class="festival-info">
            <span class="festival-category">문화</span>
            <h3 class="festival-title">부산 국제 영화제</h3>
            <p class="festival-date">📅 2025.10.04 - 2025.10.13</p>
            <p class="festival-location">📍 부산 해운대</p>
          </div>
        </div>

        <div class="festival-card">
          <div class="festival-image">🍜</div>
          <div class="festival-info">
            <span class="festival-category">음식</span>
            <h3 class="festival-title">전주 비빔밥 축제</h3>
            <p class="festival-date">📅 2025.05.01 - 2025.05.05</p>
            <p class="festival-location">📍 전주 한옥마을</p>
          </div>
        </div>

        <div class="festival-card">
          <div class="festival-image">🎭</div>
          <div class="festival-info">
            <span class="festival-category">예술</span>
            <h3 class="festival-title">대구 국제 오페라 페스티벌</h3>
            <p class="festival-date">📅 2025.09.22 - 2025.10.08</p>
            <p class="festival-location">📍 대구 오페라하우스</p>
          </div>
        </div>

        <div class="festival-card">
          <div class="festival-image">🌸</div>
          <div class="festival-info">
            <span class="festival-category">지역축제</span>
            <h3 class="festival-title">진해 군항제</h3>
            <p class="festival-date">📅 2025.04.01 - 2025.04.10</p>
            <p class="festival-location">📍 경남 창원시</p>
          </div>
        </div>

        <div class="festival-card">
          <div class="festival-image">🎸</div>
          <div class="festival-info">
            <span class="festival-category">음악</span>
            <h3 class="festival-title">인천 펜타포트 락 페스티벌</h3>
            <p class="festival-date">📅 2025.08.09 - 2025.08.11</p>
            <p class="festival-location">📍 인천 송도</p>
          </div>
        </div>

        <div class="festival-card">
          <div class="festival-image">🏮</div>
          <div class="festival-info">
            <span class="festival-category">전통</span>
            <h3 class="festival-title">서울 연등축제</h3>
            <p class="festival-date">📅 2025.05.24 - 2025.05.26</p>
            <p class="festival-location">📍 서울 종로구</p>
          </div>
        </div>

        <div class="festival-card">
          <div class="festival-image">🎪</div>
          <div class="festival-info">
            <span class="festival-category">문화</span>
            <h3 class="festival-title">보령 머드 축제</h3>
            <p class="festival-date">📅 2025.07.19 - 2025.07.28</p>
            <p class="festival-location">📍 충남 보령시</p>
          </div>
        </div>

        <div class="festival-card">
          <div class="festival-image">🎬</div>
          <div class="festival-info">
            <span class="festival-category">예술</span>
            <h3 class="festival-title">전주 국제 영화제</h3>
            <p class="festival-date">📅 2025.04.25 - 2025.05.04</p>
            <p class="festival-location">📍 전주 전북</p>
          </div>
        </div>
      </div>

      <div class="load-more">
        <button class="load-more-btn">더 보기</button>
      </div>
    </main>
  `;
}
