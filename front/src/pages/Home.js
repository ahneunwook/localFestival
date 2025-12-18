import { createHeader } from '../components/header.js';

export function HomePage() {
  return `
    ${createHeader('home')}
    
    <main class="hero-section">
      <div class="search-section">
        <h2 class="search-title">어떤 축제를 찾으시나요? 🎉</h2>
        <div class="search-box">
          <input type="text" id="home-search-input" placeholder="축제명, 지역, 키워드로 검색해보세요">
          <button id="home-search-btn">검색</button>
        </div>
      </div>

      <div class="quick-links">
        <a href="/festivals?filter=popular" class="quick-link">
          <div class="quick-icon">🔥</div>
          <div class="quick-text">인기 축제</div>
        </a>
        <a href="/festivals?filter=nearby" class="quick-link">
          <div class="quick-icon">📍</div>
          <div class="quick-text">내 주변</div>
        </a>
        <a href="/festivals?filter=thisweek" class="quick-link">
          <div class="quick-icon">📅</div>
          <div class="quick-text">이번 주</div>
        </a>
        <a href="/favorites" class="quick-link">
          <div class="quick-icon">❤️</div>
          <div class="quick-text">찜한 축제</div>
        </a>
      </div>

      <h2 class="section-title">지금 주목받는 축제</h2>
      <div class="info-grid">
        <a href="/festivals?status=ongoing" class="info-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#a8d8ea" stroke-width="1.5">
              <circle cx="25" cy="25" r="18"/>
              <path d="M 25 10 L 25 25 L 35 25"/>
            </svg>
          </div>
          <div class="card-label">실시간</div>
          <div class="card-title">진행 중인 축제</div>
          <div class="card-subtitle">현재 전국에서 진행되고 있는 축제</div>
        </a>

        <a href="/top10" class="info-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#d4a5d8" stroke-width="1.5">
              <polygon points="25,8 30,20 43,22 34,31 36,44 25,38 14,44 16,31 7,22 20,20"/>
            </svg>
          </div>
          <div class="card-label">조회수 기준</div>
          <div class="card-title">인기 축제 TOP 10</div>
          <div class="card-subtitle">가장 많은 관심을 받는 축제</div>
        </a>

        <a href="/festivals/regions" class="info-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#ffa07a" stroke-width="1.5">
              <path d="M 25 10 C 18 10 12 16 12 23 C 12 32 25 42 25 42 C 25 42 38 32 38 23 C 38 16 32 10 25 10 Z"/>
              <circle cx="25" cy="23" r="5"/>
            </svg>
          </div>
          <div class="card-label">17개 시도</div>
          <div class="card-title">지역별 축제</div>
          <div class="card-subtitle">원하는 지역의 축제를 찾아보세요</div>
        </a>

        <a href="/calendar" class="info-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#98d8c8" stroke-width="1.5">
              <rect x="10" y="15" width="30" height="25" rx="2"/>
              <line x1="10" y1="22" x2="40" y2="22"/>
              <line x1="17" y1="10" x2="17" y2="18"/>
              <line x1="33" y1="10" x2="33" y2="18"/>
            </svg>
          </div>
          <div class="card-label">캘린더 뷰</div>
          <div class="card-title">월간 캘린더</div>
          <div class="card-subtitle">이번 달 축제 일정</div>
        </a>

        <a href="/festivals?sort=newest" class="info-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#f6c667" stroke-width="1.5">
              <polygon points="25,5 30,20 45,20 33,28 37,43 25,35 13,43 17,28 5,20 20,20"/>
            </svg>
          </div>
          <div class="card-label new">NEW</div>
          <div class="card-title">새로 등록된 축제</div>
          <div class="card-subtitle">최근 추가된 축제 정보</div>
        </a>

        <a href="/reviews" class="info-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#c497d4" stroke-width="1.5">
              <path d="M 10 35 L 10 15 C 10 12 12 10 15 10 L 35 10 C 38 10 40 12 40 15 L 40 30 C 40 33 38 35 35 35 L 18 35 L 10 42 Z"/>
              <line x1="17" y1="20" x2="33" y2="20"/>
              <line x1="17" y1="26" x2="28" y2="26"/>
            </svg>
          </div>
          <div class="card-label">리뷰 324개</div>
          <div class="card-title">축제 후기</div>
          <div class="card-subtitle">생생한 축제 경험담</div>
        </a>
      </div>
    </main>
  `;
}

// Home 페이지 검색 이벤트 리스너
export function setupHomeSearchListeners() {
  const searchBtn = document.getElementById('home-search-btn');
  const searchInput = document.getElementById('home-search-input');

  if (searchBtn && searchInput) {
    const handleSearch = () => {
      const keyword = searchInput.value.trim();
      if (keyword) {
        window.location.href = `/search?q=${encodeURIComponent(keyword)}`;
      }
    };

    searchBtn.addEventListener('click', handleSearch);

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });
  }
}