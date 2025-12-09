import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';

// 전역 변수
let currentPage = 0;
let currentCategory = null;
let currentStatus = 'all';
let currentRegion = null;
let hasMorePages = false;

// 지역별 아이콘 매핑
const REGION_ICONS = {
    '서울': '🏙️',
    '부산': '🏖️',
    '대구': '🎭',
    '인천': '🌊',
    '광주': '🎨',
    '대전': '🔬',
    '울산': '🏭',
    '세종': '🏛️',
    '경기': '🏘️',
    '강원': '⛰️',
    '충북': '🌳',
    '충남': '🌾',
    '전북': '🍚',
    '전남': '🌅',
    '경북': '🏯',
    '경남': '🌸',
    '제주': '🍊'
};

const REGION_COLORS = {
    '서울': '#667eea',
    '부산': '#f093fb',
    '대구': '#ff6b6b',
    '인천': '#4ecdc4',
    '광주': '#ffd93d',
    '대전': '#a8d8ea',
    '울산': '#95e1d3',
    '세종': '#c7ceea',
    '경기': '#ff6b9d',
    '강원': '#98d8c8',
    '충북': '#f6c667',
    '충남': '#c497d4',
    '전북': '#a8d8ea',
    '전남': '#ffa07a',
    '경북': '#d4a5d8',
    '경남': '#98d8c8',
    '제주': '#ffa07a'
};

export function RegionFestivalListPage() {
    // URL에서 지역 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const region = decodeURIComponent(urlParams.get("region"));
    const status = urlParams.get("status") || 'all';
    const category = urlParams.get("category") || null;

    currentRegion = region;
    currentStatus = status;
    currentCategory = category;

    requestAnimationFrame(() => {
        initializePage();
    });

    const regionIcon = REGION_ICONS[region] || '📍';
    const regionColor = REGION_COLORS[region] || '#667eea';

    return `
    ${createHeader('festivals')}

    <main class="region-festival-container" style="--region-color: ${regionColor}">
      <!-- 지역 헤더 -->
      <div class="region-festival-header">
        <div class="region-header-content">
          <a href="/festivals/regions" class="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>지역 목록</span>
          </a>
          
          <div class="region-title-section">
            <div class="region-icon-large">${regionIcon}</div>
            <div class="region-title-text">
              <h1 class="region-title">${region} 지역 축제</h1>
              <p class="region-subtitle">${region}에서 열리는 다양한 축제를 만나보세요</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 카테고리 필터 -->
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
          <button class="filter-tab" data-category="기타">기타</button>
        </div>
      </div>

      <!-- 축제 그리드 -->
      <div class="festivals-grid" id="festivals-grid">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>축제 목록을 불러오는 중...</p>
        </div>
      </div>

      <!-- 더보기 버튼 -->
      <div class="load-more-section" id="load-more-section" style="display: none;">
        <button class="load-more-btn" id="load-more-btn">
          <span>더 보기</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>
    </main>
  `;
}

async function initializePage() {
    setupFilterTabs();
    await loadRegionFestivals();
    setupLoadMoreButton();
}

function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', async () => {
            // 활성화 상태 변경
            filterTabs.forEach(b => b.classList.remove('active'));
            tab.classList.add('active');

            // 필터 설정
            if (tab.dataset.filter) {
                // 상태 필터 (전체, 진행중, 예정)
                currentStatus = tab.dataset.filter;
                currentCategory = null;
            } else if (tab.dataset.category) {
                // 카테고리 필터 (음악, 문화, 예술 등)
                currentCategory = tab.dataset.category;
                currentStatus = 'all';
            }

            updateURL();

            // 페이지 초기화 및 재로드
            currentPage = 0;
            await loadRegionFestivals();
        });
    });
}

function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            currentPage++;
            await loadRegionFestivals(true);
        });
    }
}

async function loadRegionFestivals(append = false) {
    const gridElement = document.getElementById('festivals-grid');
    const loadMoreSection = document.getElementById('load-more-section');

    try {
        // 로딩 표시 (첫 페이지만)
        if (!append) {
            gridElement.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>축제 목록을 불러오는 중...</p>
                </div>
            `;
        }

        // API 호출 - status와 category 파라미터 추가
        const data = await festivalApi.getRegionFestival(
            currentRegion,
            currentPage,
            currentStatus,
            currentCategory
        );

        const festivals = data.content || [];
        const hasNext = data.hasNext || false;

        // 첫 페이지면 그리드 초기화
        if (!append) {
            gridElement.innerHTML = '';
        }

        // 축제 카드 렌더링
        if (festivals.length > 0) {
            festivals.forEach(festival => {
                const card = createFestivalCard(festival);
                gridElement.insertAdjacentHTML('beforeend', card);
            });

            // 더보기 버튼 표시 여부
            hasMorePages = hasNext;
            loadMoreSection.style.display = hasNext ? 'flex' : 'none';
        } else if (!append) {
            // 결과 없음 메시지
            let filterText = '';
            if (currentStatus === 'ongoing') {
                filterText = '진행중 ';
            } else if (currentStatus === 'upcoming') {
                filterText = '예정된 ';
            }
            if (currentCategory) {
                filterText += `'${currentCategory}' 카테고리의 `;
            }

            gridElement.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>검색 결과가 없습니다</h3>
                    <p>${currentRegion} 지역에서 ${filterText}축제를 찾을 수 없습니다.</p>
                </div>
            `;
            loadMoreSection.style.display = 'none';
        }

    } catch (error) {
        console.error('Error loading festivals:', error);
        if (!append) {
            gridElement.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">⚠️</div>
                    <h3>오류가 발생했습니다</h3>
                    <p>축제 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.</p>
                </div>
            `;
        }
    }
}

function createFestivalCard(festival) {
    console.log(festival);
    const startDate = new Date(festival.startDate);
    const endDate = new Date(festival.endDate);
    const today = new Date();

    // const formatDate = (date) => {
    //     const month = date.getMonth() + 1;
    //     const day = date.getDate();
    //     return `${month}.${day}`;
    // };

    // 축제 상태 결정
    let statusBadge = '';
    let statusClass = '';

    if (today >= startDate && today <= endDate) {
        statusBadge = '<div class="status-badge ongoing">진행중</div>';
        statusClass = 'ongoing';
    } else if (today < startDate) {
        statusBadge = '<div class="status-badge upcoming">예정</div>';
        statusClass = 'upcoming';
    } else {
        statusBadge = '<div class="status-badge ended">종료</div>';
        statusClass = 'ended';
    }

    const regionColor = REGION_COLORS[currentRegion] || '#667eea';

    return `
    <a href="/festival/detail?id=${festival.id}" class="festival-card ${statusClass}">
      <div class="festival-image" style="background: linear-gradient(135deg, ${regionColor} 0%, color-mix(in srgb, ${regionColor} 70%, black) 100%);">
        <div class="festival-image-icon">🎪</div>
        ${statusBadge}
      </div>
      <div class="festival-card-content">
        <div class="festival-category-badge">${festival.category}</div>
        <h3 class="festival-card-title">${festival.title}</h3>
        <div class="festival-meta">
          <div class="meta-item">
            <span class="meta-icon">📅</span>
            <span class="meta-text">${festival.startDate} - ${festival.endDate}</span>
          </div>
          <div class="meta-item">
            <span class="meta-icon">📍</span>
            <span class="meta-text">${festival.address || '장소 미정'}</span>
          </div>
        </div>
      </div>
    </a>
  `;
}

function updateURL() {
    const params = new URLSearchParams();
    params.set('region', currentRegion);

    if (currentStatus && currentStatus !== 'all') {
        params.set('status', currentStatus);
    }

    if (currentCategory) {
        params.set('category', currentCategory);
    }

    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newURL }, '', newURL);
}

// Export 함수
export { loadRegionFestivals };