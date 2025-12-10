import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';
import { getCategoryEmoji, formatDateRange, formatLocation, getCategoryColor } from '../utils/festivalHelpers.js';

// 전역 변수
let currentPage = 0;
let currentFilter = 'all';
let currentCategory = null;
let hasMorePages = false;

export function FestivalListPage() {
  setTimeout(() => {
    initializePage();
  }, 0);

  return `
    ${createHeader('list')}

    <main class="main-container">
      <div class="page-header">
        <h1 class="page-title">축제 목록</h1>
        <p class="page-subtitle">전국의 다양한 축제를 만나보세요</p>
      </div>

      <div class="filter-section">
        <div class="filter-tabs">
          <button class="filter-tab active" data-filter="all">전체</button>
          <button class="filter-tab" data-filter="ongoing">진행중</button>
          <button class="filter-tab" data-filter="upcoming">예정</button>
          <button class="filter-tab" data-category="음악">음악</button>
          <button class="filter-tab" data-category="문화">문화</button>
          <button class="filter-tab" data-category="예술">예술</button>
          <button class="filter-tab" data-category="음식">음식</button>
          <button class="filter-tab" data-category="전통">전통</button>
        </div>
      </div>

      <div class="festival-grid" id="festival-grid">
        <div class="loading-message">축제 목록을 불러오는 중...</div>
      </div>

      <div class="load-more" id="load-more" style="display: none;">
        <button class="load-more-btn" onclick="loadMore()">더 보기</button>
      </div>
    </main>
  `;
};

// 페이지 초기화
function initializePage() {
  currentPage = 0;
  currentFilter = 'all';
  currentCategory = null;
  loadAllFestivals();
  initializeFilters();
}

// 전체 축제 로드
async function loadAllFestivals(append = false) {
  const grid = document.getElementById('festival-grid');
  if (!grid) return;

  if (!append) {
    grid.innerHTML = '<div class="loading-message">축제 목록을 불러오는 중...</div>';
    currentPage = 0;
  }

  try {
    const result = await festivalApi.getAllFestivals(currentPage);
    displayFestivals(result.content, append);
    updateLoadMoreButton(result.hasNext);
    hasMorePages = result.hasNext;
  } catch (error) {
    console.error('축제 목록 로드 실패:', error);
    if (!append) {
      grid.innerHTML = '<div class="error-message">축제 목록을 불러오는데 실패했습니다.</div>';
    }
  }
}

// 진행 중인 축제 로드
async function loadOngoingFestivals(append = false) {
  const grid = document.getElementById('festival-grid');
  if (!grid) return;

  if (!append) {
    grid.innerHTML = '<div class="loading-message">진행 중인 축제를 불러오는 중...</div>';
    currentPage = 0;
  }

  try {
    const result = await festivalApi.getOngoingFestivals(currentPage);
    displayFestivals(result.content, append);
    updateLoadMoreButton(result.hasNext);
    hasMorePages = result.hasNext;
  } catch (error) {
    console.error('진행 중인 축제 로드 실패:', error);
    if (!append) {
      grid.innerHTML = '<div class="error-message">축제 목록을 불러오는데 실패했습니다.</div>';
    }
  }
}

// 예정된 축제 로드
async function loadUpcomingFestivals(append = false) {
  const grid = document.getElementById('festival-grid');
  if (!grid) return;

  if (!append) {
    grid.innerHTML = '<div class="loading-message">예정된 축제를 불러오는 중...</div>';
    currentPage = 0;
  }

  try {
    const result = await festivalApi.getUpcomingFestivals(currentPage);
    displayFestivals(result.content, append);
    updateLoadMoreButton(result.hasNext);
    hasMorePages = result.hasNext;
  } catch (error) {
    console.error('예정된 축제 로드 실패:', error);
    if (!append) {
      grid.innerHTML = '<div class="error-message">축제 목록을 불러오는데 실패했습니다.</div>';
    }
  }
}

// 카테고리별 축제 로드
async function loadFestivalsByCategory(category, append = false) {
  const grid = document.getElementById('festival-grid');
  if (!grid) return;

  if (!append) {
    grid.innerHTML = '<div class="loading-message">축제 목록을 불러오는 중...</div>';
    currentPage = 0;
  }

  try {
    const result = await festivalApi.getFestivalsByCategory(category, currentPage);
    displayFestivals(result.content, append);
    updateLoadMoreButton(result.hasNext);
    hasMorePages = result.hasNext;
  } catch (error) {
    console.error('카테고리별 축제 로드 실패:', error);
    if (!append) {
      grid.innerHTML = '<div class="error-message">축제 목록을 불러오는데 실패했습니다.</div>';
    }
  }
}

// 축제 목록 표시
function displayFestivals(festivals, append = false) {
  const grid = document.getElementById('festival-grid');
  if (!grid) return;

  if (!festivals || festivals.length === 0) {
    if (!append) {
      grid.innerHTML = '<div class="empty-message">축제가 없습니다.</div>';
    }
    return;
  }

  const festivalHTML = festivals.map(festival => `
    <div class="festival-card" onclick="window.location.href='/festival/detail?id=${festival.id}'" style="cursor: pointer;">
      <div class="festival-image">${getCategoryEmoji(festival.category)}</div>
      <div class="festival-info">
        <span class="festival-category" style="background-color: ${getCategoryColor(festival.category)}; color: white;">${festival.category || '기타'}</span>
        <h3 class="festival-title">${festival.title}</h3>
        <p class="festival-date">📅 ${formatDateRange(festival.startDate, festival.endDate)}</p>
        <p class="festival-location">📍 ${formatLocation(festival.region, festival.venue)}</p>
      </div>
    </div>
  `).join('');

  if (append) {
    grid.insertAdjacentHTML('beforeend', festivalHTML);
  } else {
    grid.innerHTML = festivalHTML;
  }
}

// 더보기 버튼 업데이트
function updateLoadMoreButton(hasNext) {
  const loadMoreDiv = document.getElementById('load-more');
  if (loadMoreDiv) {
    loadMoreDiv.style.display = hasNext ? 'block' : 'none';
  }
}

// 더보기 버튼 클릭
window.loadMore = async function() {
  currentPage++;
  
  if (currentFilter === 'all') {
    await loadAllFestivals(true);
  } else if (currentFilter === 'ongoing') {
    await loadOngoingFestivals(true);
  } else if (currentFilter === 'upcoming') {
    await loadUpcomingFestivals(true);
  } else if (currentCategory) {
    await loadFestivalsByCategory(currentCategory, true);
  }
};

// 카테고리 이모지 가져오기
// 필터 초기화
function initializeFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // 페이지 초기화
      currentPage = 0;

      // 필터 타입에 따라 로드
      const filter = tab.dataset.filter;
      const category = tab.dataset.category;

      if (filter === 'all') {
        currentFilter = 'all';
        currentCategory = null;
        await loadAllFestivals();
      } else if (filter === 'ongoing') {
        currentFilter = 'ongoing';
        currentCategory = null;
        await loadOngoingFestivals();
      } else if (filter === 'upcoming') {
        currentFilter = 'upcoming';
        currentCategory = null;
        await loadUpcomingFestivals();
      } else if (category) {
        currentFilter = 'category';
        currentCategory = category;
        await loadFestivalsByCategory(category);
      }
    });
  });
}