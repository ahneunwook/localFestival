import { createHeader } from '../components/header.js';
import { newsApi } from '../api/NewsApi.js';

// 상태 관리
let currentPage = 0;
let totalPages = 0;
let currentNewsList = [];

export function NewsPage() {
  return `
    ${createHeader('news')}
    
    <main class="news-page">
      <div class="news-container">
        <div class="news-header">
          <h1 class="page-title">공지사항</h1>
          <button class="btn-write" id="btnWriteNews">글쓰기</button>
        </div>
        
        <div class="news-content">
          <div class="news-list-section">
            <div id="newsList" class="loading-message">불러오는 중...</div>
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
    
    <!-- 글쓰기 모달 -->
    <div class="modal-overlay" id="writeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 id="modalTitle">공지사항 작성</h2>
          <button class="modal-close" id="btnCloseModal">&times;</button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="editNewsId" value="">
          <div class="form-group">
            <label for="newsTitle">제목</label>
            <input type="text" id="newsTitle" placeholder="제목을 입력하세요" maxlength="200">
          </div>
          <div class="form-group">
            <label for="newsContent">내용</label>
            <textarea id="newsContent" placeholder="내용을 입력하세요" rows="10"></textarea>
          </div>
          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" id="newsImportant">
              <span>중요 공지사항으로 설정</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" id="btnCancelWrite">취소</button>
          <button class="btn-submit" id="btnSubmitNews">등록</button>
        </div>
      </div>
    </div>
  `;
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

  if (!newsList || newsList.length === 0) {
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
    item.addEventListener('click', async () => {
      const newsId = parseInt(item.dataset.id);
      await loadNewsDetail(newsId);
    });
  });
}

// 뉴스 상세 로드
async function loadNewsDetail(newsId) {
  const newsDetailEl = document.getElementById('newsDetail');
  if (!newsDetailEl) return;

  try {
    const news = await newsApi.getNewsDetail(newsId);
    renderNewsDetail(news);
  } catch (error) {
    console.error('Failed to load news detail:', error);
    newsDetailEl.innerHTML = '<div class="error-message">공지사항을 불러오는데 실패했습니다.</div>';
  }
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
    <div class="news-detail-actions">
      <button class="btn-back" id="btnBackToList">목록으로</button>
      <div class="action-btns">
        <button class="btn-edit" id="btnEditNews" data-id="${news.id}">수정</button>
        <button class="btn-delete" id="btnDeleteNews" data-id="${news.id}">삭제</button>
      </div>
    </div>
  `;

  // 목록으로 버튼
  document.getElementById('btnBackToList')?.addEventListener('click', () => {
    newsDetailEl.className = 'news-detail-empty';
    newsDetailEl.innerHTML = '<p>공지사항을 선택해주세요.</p>';
  });

  // 수정 버튼
  document.getElementById('btnEditNews')?.addEventListener('click', () => {
    openEditModal(news);
  });

  // 삭제 버튼
  document.getElementById('btnDeleteNews')?.addEventListener('click', async () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await newsApi.deleteNews(news.id);
        alert('삭제되었습니다.');
        newsDetailEl.className = 'news-detail-empty';
        newsDetailEl.innerHTML = '<p>공지사항을 선택해주세요.</p>';
        await loadNews(currentPage);
      } catch (error) {
        alert('삭제에 실패했습니다.');
      }
    }
  });
}

// 페이지네이션 렌더링
function renderPagination() {
  const paginationEl = document.getElementById('pagination');
  if (!paginationEl || totalPages <= 1) {
    if (paginationEl) paginationEl.innerHTML = '';
    return;
  }

  const maxVisible = 5;
  const current = currentPage + 1; // 0-indexed to 1-indexed
  let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  paginationEl.innerHTML = `
    <div class="pagination">
      <button class="page-btn" data-page="0" ${currentPage === 0 ? 'disabled' : ''}>처음</button>
      <button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 0 ? 'disabled' : ''}>이전</button>
      
      ${Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => `
        <button class="page-btn ${page - 1 === currentPage ? 'active' : ''}" data-page="${page - 1}">
          ${page}
        </button>
      `).join('')}
      
      <button class="page-btn" data-page="${currentPage + 1}" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>다음</button>
      <button class="page-btn" data-page="${totalPages - 1}" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>마지막</button>
    </div>
  `;

  // 페이지 버튼 이벤트
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const page = parseInt(btn.dataset.page);
      if (!isNaN(page) && page >= 0 && page < totalPages && page !== currentPage) {
        await loadNews(page);
      }
    });
  });
}

// 뉴스 로드 (API 호출)
async function loadNews(page = 0) {
  const newsListEl = document.getElementById('newsList');
  
  try {
    if (newsListEl) {
      newsListEl.innerHTML = '<div class="loading-message">불러오는 중...</div>';
    }

    const response = await newsApi.getNewsList(page, 10);
    currentPage = page;
    totalPages = response.totalPages || 0;
    currentNewsList = response.content || [];

    renderNewsList(currentNewsList);
    renderPagination();
  } catch (error) {
    console.error('Failed to load news:', error);
    if (newsListEl) {
      newsListEl.innerHTML = '<div class="error-message">공지사항을 불러오는데 실패했습니다.</div>';
    }
  }
}

// 모달 열기 (글쓰기)
function openWriteModal() {
  const modal = document.getElementById('writeModal');
  const modalTitle = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('btnSubmitNews');
  
  document.getElementById('editNewsId').value = '';
  document.getElementById('newsTitle').value = '';
  document.getElementById('newsContent').value = '';
  document.getElementById('newsImportant').checked = false;
  
  modalTitle.textContent = '공지사항 작성';
  submitBtn.textContent = '등록';
  
  modal.classList.add('active');
}

// 모달 열기 (수정)
function openEditModal(news) {
  const modal = document.getElementById('writeModal');
  const modalTitle = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('btnSubmitNews');
  
  document.getElementById('editNewsId').value = news.id;
  document.getElementById('newsTitle').value = news.title;
  document.getElementById('newsContent').value = news.content;
  document.getElementById('newsImportant').checked = news.important;
  
  modalTitle.textContent = '공지사항 수정';
  submitBtn.textContent = '수정';
  
  modal.classList.add('active');
}

// 모달 닫기
function closeModal() {
  const modal = document.getElementById('writeModal');
  modal.classList.remove('active');
}

// 공지사항 등록/수정
async function submitNews() {
  const editId = document.getElementById('editNewsId').value;
  const title = document.getElementById('newsTitle').value.trim();
  const content = document.getElementById('newsContent').value.trim();
  const important = document.getElementById('newsImportant').checked;

  if (!title) {
    alert('제목을 입력해주세요.');
    return;
  }
  if (!content) {
    alert('내용을 입력해주세요.');
    return;
  }

  const newsData = { title, content, important };

  try {
    if (editId) {
      // 수정
      await newsApi.updateNews(editId, newsData);
      alert('수정되었습니다.');
    } else {
      // 등록
      await newsApi.createNews(newsData);
      alert('등록되었습니다.');
    }
    
    closeModal();
    
    // 상세보기 초기화
    const newsDetailEl = document.getElementById('newsDetail');
    if (newsDetailEl) {
      newsDetailEl.className = 'news-detail-empty';
      newsDetailEl.innerHTML = '<p>공지사항을 선택해주세요.</p>';
    }
    
    await loadNews(0);
  } catch (error) {
    alert(editId ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
  }
}

// 페이지 초기화
export function setupNewsListeners() {
  // 글쓰기 버튼
  document.getElementById('btnWriteNews')?.addEventListener('click', openWriteModal);
  
  // 모달 닫기 버튼
  document.getElementById('btnCloseModal')?.addEventListener('click', closeModal);
  document.getElementById('btnCancelWrite')?.addEventListener('click', closeModal);
  
  // 모달 외부 클릭 시 닫기
  document.getElementById('writeModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'writeModal') {
      closeModal();
    }
  });
  
  // 등록/수정 버튼
  document.getElementById('btnSubmitNews')?.addEventListener('click', submitNews);
  
  // 초기 데이터 로드
  loadNews(0);
}
