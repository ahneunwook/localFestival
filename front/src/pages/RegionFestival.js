import { createHeader } from '../components/header.js';

export function RegionPage() {
    const regionData = [
        { name: '서울', count: 45, color: '#a8d8ea' },
        { name: '부산', count: 32, color: '#d4a5d8' },
        { name: '대구', count: 28, color: '#ffa07a' },
        { name: '인천', count: 24, color: '#98d8c8' },
        { name: '광주', count: 19, color: '#f6c667' },
        { name: '대전', count: 21, color: '#c497d4' },
        { name: '울산', count: 15, color: '#a8d8ea' },
        { name: '세종', count: 8, color: '#d4a5d8' },
        { name: '경기', count: 67, color: '#ffa07a' },
        { name: '강원', count: 41, color: '#98d8c8' },
        { name: '충북', count: 23, color: '#f6c667' },
        { name: '충남', count: 29, color: '#c497d4' },
        { name: '전북', count: 26, color: '#a8d8ea' },
        { name: '전남', count: 38, color: '#d4a5d8' },
        { name: '경북', count: 35, color: '#ffa07a' },
        { name: '경남', count: 42, color: '#98d8c8' },
        { name: '제주', count: 18, color: '#f6c667' }
    ];

    return `
    ${createHeader('festivals')}
    
    <main class="region-page">
      <div class="region-header">
        <h1 class="page-title">지역별 축제</h1>
        <p class="page-subtitle">원하는 지역의 축제를 찾아보세요</p>
      </div>

      <div class="region-grid">
        ${regionData.map((region, index) => `
          <div class="region-card" data-region="${region.name}" style="--region-color: ${region.color}">
            <div class="region-icon">
              <svg viewBox="0 0 50 50" fill="none" stroke="${region.color}" stroke-width="1.5">
                <path d="M 25 10 C 18 10 12 16 12 23 C 12 32 25 42 25 42 C 25 42 38 32 38 23 C 38 16 32 10 25 10 Z"/>
                <circle cx="25" cy="23" r="5"/>
              </svg>
            </div>
            
            <div class="region-info">
              <div class="region-name">${region.name}</div>
              <div class="region-count">
                <span class="count-number">${region.count}</span>
                <span class="count-label">개 축제</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}

// 이벤트 리스너 설정 함수 추가
export function setupRegionListeners() {
    const regionCards = document.querySelectorAll('.region-card');

    regionCards.forEach(card => {
        card.addEventListener('click', () => {
            const regionName = card.getAttribute('data-region');
            window.location.href = `/festivals?region=${regionName}`;
        });
    });
}