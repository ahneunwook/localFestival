import { createHeader } from '../components/header.js';

export function NewsPage() {
  return `
    ${createHeader('news')}
    
    <main class="news-page">
      <div class="news-container">
        <h1 class="page-title">공지사항</h1>
        
        <div class="news-content">
          <div class="news-list-section">
            <div id="newsList"></div>
            <div id="pagination"></div>
          </div>
          
          <div class="news-detail-section">
            <div id="newsDetail" class="news-detail-empty">
              <p>공지사항을 선택해주세요.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

// Mock 데이터
function getMockNews() {
  return [
    {
      id: 1,
      title: '2024년 전국 문화축제 일정 안내',
      content: `
        <p>안녕하세요, LocalFestival입니다.</p>
        <p>2024년 전국 각지에서 열리는 문화축제 일정을 안내드립니다.</p>
        <br>
        <p><strong>주요 축제 일정:</strong></p>
        <ul>
          <li>봄: 진해 군항제, 보령 머드축제</li>
          <li>여름: 보령 머드축제, 부산 바다축제</li>
          <li>가을: 안동 국제탈춤페스티벌, 통영 한산대첩축제</li>
          <li>겨울: 화천 산천어축제, 평창 송어축제</li>
        </ul>
        <br>
        <p>자세한 정보는 각 축제 상세 페이지에서 확인하실 수 있습니다.</p>
      `,
      important: true,
      createdAt: '2024-01-15T10:00:00',
      views: 1250
    },
    {
      id: 2,
      title: 'LocalFestival 서비스 개선 안내',
      content: `
        <p>더 나은 서비스 제공을 위해 다음과 같이 개선했습니다.</p>
        <br>
        <p><strong>개선 사항:</strong></p>
        <ul>
          <li>축제 검색 기능 강화</li>
          <li>지역별 필터링 개선</li>
          <li>모바일 UI/UX 최적화</li>
          <li>축제 이미지 품질 향상</li>
        </ul>
        <br>
        <p>앞으로도 더 좋은 서비스로 찾아뵙겠습니다.</p>
      `,
      important: false,
      createdAt: '2024-02-01T14:30:00',
      views: 856
    },
    {
      id: 3,
      title: '개인정보 처리방침 변경 안내',
      content: `
        <p>개인정보 처리방침이 다음과 같이 변경되었습니다.</p>
        <br>
        <p><strong>주요 변경사항:</strong></p>
        <ul>
          <li>수집하는 개인정보 항목 명시</li>
          <li>개인정보 보유 및 이용기간 안내</li>
          <li>개인정보 제3자 제공 관련 사항</li>
        </ul>
        <br>
        <p>변경된 개인정보 처리방침은 2024년 3월 1일부터 적용됩니다.</p>
      `,
      important: true,
      createdAt: '2024-02-20T09:00:00',
      views: 542
    },
    {
      id: 4,
      title: '설 연휴 고객센터 운영 안내',
      content: `
        <p>설 연휴 기간 동안 고객센터 운영 시간을 안내드립니다.</p>
        <br>
        <p><strong>운영 일정:</strong></p>
        <ul>
          <li>2월 9일(금): 정상 운영</li>
          <li>2월 10일(토) ~ 2월 12일(월): 휴무</li>
          <li>2월 13일(화): 정상 운영</li>
        </ul>
        <br>
        <p>휴무 기간 중 긴급 문의는 이메일로 남겨주시기 바랍니다.</p>
      `,
      important: false,
      createdAt: '2024-02-05T11:20:00',
      views: 423
    },
    {
      id: 5,
      title: '회원 등급제 도입 안내',
      content: `
        <p>회원님들께 더 많은 혜택을 드리기 위해 회원 등급제를 도입합니다.</p>
        <br>
        <p><strong>등급별 혜택:</strong></p>
        <ul>
          <li>브론즈: 기본 서비스 이용</li>
          <li>실버: 축제 알림 서비스</li>
          <li>골드: 프리미엄 추천 서비스</li>
          <li>플래티넘: VIP 전용 이벤트 참여</li>
        </ul>
        <br>
        <p>자세한 내용은 마이페이지에서 확인하실 수 있습니다.</p>
      `,
      important: false,
      createdAt: '2024-01-28T16:45:00',
      views: 789
    },
    {
      id: 6,
      title: '여름 축제 특별 기획전',
      content: `
        <p>더운 여름, 시원한 축제를 즐겨보세요!</p>
        <br>
        <p><strong>추천 여름 축제:</strong></p>
        <ul>
          <li>보령 머드축제 - 7월 중순</li>
          <li>부산 바다축제 - 8월 초</li>
          <li>대천 해수욕장 축제 - 7월 말</li>
          <li>무주 반딧불축제 - 6월 초</li>
        </ul>
        <br>
        <p>여름 축제 특별 할인 이벤트도 진행 중입니다!</p>
      `,
      important: false,
      createdAt: '2024-05-20T10:30:00',
      views: 1035
    }
  ];
}

// 날짜 포맷팅
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// 뉴스 목록 렌더링
function renderNewsList(newsList) {
  const newsListEl = document.getElementById('newsList');
  if (!newsListEl) return;

  if (newsList.length === 0) {
    newsListEl.innerHTML = '<div class="empty-message">등록된 공지사항이 없습니다.</div>';
    return;
  }

  newsListEl.innerHTML = `
    <ul class="news-list">
      ${newsList.map(news => `
        <li class="news-item ${news.important ? 'important' : ''}" data-id="${news.id}">
          <div class="news-item-header">
            ${news.important ? '<span class="badge-important">중요</span>' : ''}
            <h3 class="news-item-title">${news.title}</h3>
          </div>
          <div class="news-item-meta">
            <span class="news-date">${formatDate(news.createdAt)}</span>
            <span class="news-views">조회 ${news.views}</span>
          </div>
        </li>
      `).join('')}
    </ul>
  `;

  // 아이템 클릭 이벤트
  document.querySelectorAll('.news-item').forEach(item => {
    item.addEventListener('click', () => {
      const newsId = parseInt(item.dataset.id);
      const selectedNews = newsList.find(n => n.id === newsId);
      if (selectedNews) {
        renderNewsDetail(selectedNews);
      }
    });
  });
}

// 뉴스 상세 렌더링
function renderNewsDetail(news) {
  const newsDetailEl = document.getElementById('newsDetail');
  if (!newsDetailEl) return;

  newsDetailEl.className = 'news-detail';
  newsDetailEl.innerHTML = `
    <div class="news-detail-header">
      ${news.important ? '<span class="badge-important">중요</span>' : ''}
      <h2>${news.title}</h2>
      <div class="news-detail-meta">
        <span>${formatDate(news.createdAt)}</span>
        <span>조회 ${news.views}</span>
      </div>
    </div>
    <div class="news-detail-content">
      ${news.content}
    </div>
    <button class="btn-back" id="btnBackToList">목록으로</button>
  `;

  // 목록으로 버튼
  document.getElementById('btnBackToList')?.addEventListener('click', () => {
    newsDetailEl.className = 'news-detail-empty';
    newsDetailEl.innerHTML = '<p>공지사항을 선택해주세요.</p>';
  });
}

// 페이지네이션 렌더링
function renderPagination(currentPage, totalPages) {
  const paginationEl = document.getElementById('pagination');
  if (!paginationEl || totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  paginationEl.innerHTML = `
    <div class="pagination">
      <button class="page-btn" data-page="1" ${currentPage === 1 ? 'disabled' : ''}>처음</button>
      <button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>이전</button>
      
      ${Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => `
        <button class="page-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">
          ${page}
        </button>
      `).join('')}
      
      <button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>다음</button>
      <button class="page-btn" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''}>마지막</button>
    </div>
  `;

  // 페이지 버튼 이벤트
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (page && !btn.disabled) {
        loadNews(page);
      }
    });
  });
}

// 뉴스 로드
function loadNews(page = 1) {
  const pageSize = 5;
  const allNews = getMockNews();
  const totalPages = Math.ceil(allNews.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageNews = allNews.slice(start, end);

  renderNewsList(pageNews);
  renderPagination(page, totalPages);
}

// 페이지 초기화
export function setupNewsListeners() {
  loadNews(1);
}
