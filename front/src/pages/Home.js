import { createHeader } from '../components/header.js';

export function HomePage() {
  return `
    ${createHeader('home')}
    
    <main class="hero-section">
      <div class="hero-cards">
        <div class="hero-card music">
          <div class="category">Music Festival</div>
          <div class="title">음악축제</div>
          <div class="geometric-pattern">
            <svg viewBox="0 0 150 150">
              <line x1="30" y1="30" x2="120" y2="30" stroke="white" stroke-width="2"/>
              <line x1="120" y1="30" x2="120" y2="120" stroke="white" stroke-width="2"/>
              <line x1="30" y1="30" x2="75" y2="120" stroke="white" stroke-width="2"/>
              <line x1="75" y1="120" x2="120" y2="120" stroke="white" stroke-width="2"/>
            </svg>
          </div>
        </div>
        <div class="hero-card culture">
          <div class="category">Cultural Festival</div>
          <div class="title">문화축제</div>
          <div class="geometric-pattern">
            <svg viewBox="0 0 150 150">
              <rect x="40" y="40" width="70" height="70" fill="none" stroke="white" stroke-width="2"/>
              <line x1="40" y1="75" x2="110" y2="75" stroke="white" stroke-width="2"/>
              <line x1="75" y1="40" x2="75" y2="110" stroke="white" stroke-width="2"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="search-section">
        <div class="search-box">
          <input type="text" id="home-search-input" placeholder="원하시는 축제나 지역을 검색해보세요.">
          <button id="home-search-btn">검색</button>
        </div>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#999999" stroke-width="2">
              <rect x="10" y="15" width="30" height="25"/>
              <line x1="10" y1="10" x2="40" y2="10"/>
              <line x1="15" y1="10" x2="15" y2="15"/>
              <line x1="35" y1="10" x2="35" y2="15"/>
            </svg>
          </div>
          <div class="card-title">축제 소개</div>
          <div class="card-subtitle">페스티벌 정보</div>
        </div>

        <div class="info-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#999999" stroke-width="2">
              <polygon points="25,5 40,40 10,40"/>
              <circle cx="25" cy="30" r="3"/>
            </svg>
          </div>
          <div class="card-title">참가 안내</div>
          <div class="card-subtitle">예매 및 티켓</div>
        </div>

        <div class="info-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#999999" stroke-width="2">
              <polygon points="10,15 25,5 40,15 40,40 10,40"/>
              <path d="M 20 25 L 30 25 L 30 40 L 20 40 Z"/>
            </svg>
          </div>
          <div class="card-title">축제 소식</div>
          <div class="card-subtitle">홍보센터</div>
        </div>
      </div>

      <div class="secondary-grid">
        <div class="secondary-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#999999" stroke-width="2">
              <rect x="10" y="15" width="30" height="25" rx="2"/>
              <line x1="10" y1="22" x2="40" y2="22"/>
            </svg>
          </div>
          <div class="card-title">프로그램</div>
          <div class="card-subtitle">행사 일정</div>
        </div>

        <div class="secondary-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#999999" stroke-width="2">
              <rect x="12" y="12" width="26" height="26"/>
              <line x1="18" y1="20" x2="32" y2="20"/>
              <line x1="18" y1="25" x2="32" y2="25"/>
              <line x1="18" y1="30" x2="28" y2="30"/>
            </svg>
          </div>
          <div class="card-title">뉴스</div>
          <div class="card-subtitle">최신 소식</div>
        </div>

        <div class="secondary-card">
          <div class="icon">
            <svg viewBox="0 0 50 50" fill="none" stroke="#999999" stroke-width="2">
              <rect x="10" y="15" width="30" height="20" rx="2"/>
              <path d="M 10 15 L 25 27 L 40 15"/>
            </svg>
          </div>
          <div class="card-title">문의하기</div>
          <div class="card-subtitle">연락처 및 위치</div>
        </div>
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
