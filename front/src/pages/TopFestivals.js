import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';
import { formatDate } from '../utils/festivalHelpers.js';

export function TopFestivalsPage() {
  return `
    ${createHeader('home')}
    
    <main class="top10-container">
      <div class="top10-header">
        <h1 class="top10-page-title">🏆 인기 축제 TOP 10</h1>
        <p class="top10-page-subtitle">가장 사랑받는 축제를 만나보세요</p>
      </div>

      <div class="top10-tab-container">
        <button class="top10-tab-btn active" data-tab="likes">
          <span class="top10-tab-icon">❤️</span>
          <span class="top10-tab-text">좋아요순</span>
        </button>
        <button class="top10-tab-btn" data-tab="views">
          <span class="top10-tab-icon">👀</span>
          <span class="top10-tab-text">조회순</span>
        </button>
      </div>

      <div class="top10-list" id="festivals-list">
        <div class="top10-loading">
          <div class="top10-spinner"></div>
          <p>축제 정보를 불러오는 중...</p>
        </div>
      </div>
    </main>
  `;
}

export async function setupTopFestivalsListeners() {
  const tabButtons = document.querySelectorAll('.top10-tab-btn');
  let currentTab = 'likes';

  // 탭 전환 이벤트
  tabButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const tab = btn.dataset.tab;
      if (tab === currentTab) return;

      // 탭 활성화 상태 변경
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentTab = tab;
      await loadFestivals(tab);
    });
  });

  // 초기 데이터 로드
  await loadFestivals(currentTab);
}

async function loadFestivals(sortBy) {
  const listContainer = document.getElementById('festivals-list');
  
  try {
    listContainer.innerHTML = `
      <div class="top10-loading">
        <div class="top10-spinner"></div>
        <p>축제 정보를 불러오는 중...</p>
      </div>
    `;

    const response = sortBy === 'likes' 
      ? await festivalApi.getTop10ByLikes()
      : await festivalApi.getTop10ByViews();

    // apiFetch가 이미 data를 추출해서 반환하므로 response.content로 바로 접근
    const festivals = response.content || [];

    if (!festivals || festivals.length === 0) {
      listContainer.innerHTML = `
        <div class="top10-empty">
          <div class="top10-empty-icon">📭</div>
          <p>아직 인기 축제 데이터가 없습니다</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = festivals.map((festival, index) => 
      createFestivalCard(festival, index + 1, sortBy)
    ).join('');

    // 카드 클릭 이벤트
    setupCardClickListeners();

  } catch (error) {
    console.error('축제 목록 로드 실패:', error);
    listContainer.innerHTML = `
      <div class="top10-error">
        <div class="top10-error-icon">⚠️</div>
        <p>축제 정보를 불러오는데 실패했습니다</p>
        <button class="top10-retry-btn" onclick="location.reload()">다시 시도</button>
      </div>
    `;
  }
}

function createFestivalCard(festival, rank, sortBy) {
  const rankClass = rank <= 3 ? `rank-${rank}` : '';
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
  
  // 날짜 포맷팅 (utils 활용)
  const startDate = festival.startDate ? formatDate(festival.startDate) : '';
  const endDate = festival.endDate ? formatDate(festival.endDate) : '';
  const dateRange = startDate && endDate ? `${startDate} ~ ${endDate}` : '날짜 미정';

  // 상태 배지 (TOP 10 전용 스타일)
  const statusBadge = getStatusBadge(festival.eventStatus);

  // 통계 정보
  const statInfo = sortBy === 'likes' 
    ? `<span class="top10-stat-like">❤️ ${festival.likeCount || 0}</span>`
    : `<span class="top10-stat-view">👀 ${festival.viewCount || 0}</span>`;

  return `
    <div class="top10-card" data-festival-id="${festival.id}">
      <div class="top10-rank-badge ${rankClass}">
        <span class="top10-rank-number">${rankEmoji || rank}</span>
      </div>
      
      <div class="top10-image">
        ${festival.imageUrl 
          ? `<img src="${festival.imageUrl}" alt="${festival.title}" onerror="this.src='/placeholder-festival.jpg'">` 
          : '<div class="top10-no-image">🎉</div>'
        }
        ${statusBadge}
      </div>

      <div class="top10-content">
        <h3 class="top10-title">${festival.title}</h3>
        
        <div class="top10-info">
          <div class="top10-info-item">
            <span class="top10-info-icon">📍</span>
            <span class="top10-info-text">${festival.region || '지역 미정'}</span>
          </div>
          <div class="top10-info-item">
            <span class="top10-info-icon">📅</span>
            <span class="top10-info-text">${dateRange}</span>
          </div>
          ${festival.category ? `
            <div class="top10-info-item">
              <span class="top10-info-icon">🏷️</span>
              <span class="top10-info-text">${festival.category}</span>
            </div>
          ` : ''}
        </div>

        <div class="top10-stats">
          ${statInfo}
          <span class="top10-stat-separator">|</span>
          <span class="top10-stat-other">
            ${sortBy === 'likes' 
              ? `👀 ${festival.viewCount || 0}` 
              : `❤️ ${festival.likeCount || 0}`
            }
          </span>
        </div>
      </div>
    </div>
  `;
}

function getStatusBadge(status) {
  switch (status) {
    case 'ONGOING':
      return '<span class="top10-status-badge ongoing">진행중</span>';
    case 'SCHEDULED':
      return '<span class="top10-status-badge scheduled">예정</span>';
    case 'ENDED':
      return '<span class="top10-status-badge ended">종료</span>';
    default:
      return '';
  }
}

function setupCardClickListeners() {
  const cards = document.querySelectorAll('.top10-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const festivalId = card.dataset.festivalId;
      window.router.navigate(`/festival/detail?id=${festivalId}`);
    });
  });
}