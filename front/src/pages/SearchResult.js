import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';

export async function SearchResultPage() {
  // URL에서 검색 쿼리 파라미터 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const keyword = urlParams.get('q') || '';
  
  let festivalsHTML = '';
  
  if (keyword) {
    try {
      // API 호출 (검색)
      const festivals = await festivalApi.search({ keyword });
      
      if (festivals && festivals.length > 0) {
        festivalsHTML = festivals.map(festival => `
          <div class="search-festival-card" onclick="window.location.href='/festival/detail?id=${festival.id}'" style="cursor: pointer;">
            <div class="search-festival-image">
              ${festival.imageUrl ? 
                `<img src="${festival.imageUrl}" alt="${festival.title}">` :
                `<div class="search-festival-no-image">이미지 없음</div>`
              }
            </div>
            <div class="search-festival-info">
              <h3 class="search-festival-title">${festival.title}</h3>
              <div class="search-festival-meta">
                <span class="location">📍 ${festival.address || festival.region || '주소 정보 없음'}</span>
                <span class="date">📅 ${formatDate(festival.startDate)} ~ ${formatDate(festival.endDate)}</span>
              </div>
              <p class="search-festival-description">${festival.description || '상세 설명이 없습니다.'}</p>
              <div class="search-festival-tags">
                ${festival.category ? `<span class="search-festival-tag">${festival.category}</span>` : ''}
                ${festival.region ? `<span class="search-festival-tag">${festival.region}</span>` : ''}
              </div>
            </div>
          </div>
        `).join('');
      } else {
        festivalsHTML = `
          <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>검색 결과가 없습니다</h3>
            <p>"${keyword}"에 대한 축제를 찾을 수 없습니다.</p>
            <p>다른 키워드로 검색해보세요.</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      festivalsHTML = `
        <div class="error-message">
          <div class="error-icon">⚠️</div>
          <h3>검색 중 오류가 발생했습니다</h3>
          <p>잠시 후 다시 시도해주세요.</p>
        </div>
      `;
    }
  } else {
    festivalsHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>검색어를 입력해주세요</h3>
        <p>원하시는 축제나 지역을 검색해보세요.</p>
      </div>
    `;
  }

  return `
    ${createHeader('search')}
    
    <main class="search-result-page">
      <div class="search-header">
        <div class="search-box-container">
          <input 
            type="text" 
            id="search-input" 
            class="search-input" 
            placeholder="원하시는 축제나 지역을 검색해보세요."
            value="${keyword}"
          >
          <button id="search-btn" class="search-btn">🔍 검색</button>
        </div>
        ${keyword ? `<div class="search-info">
          <span class="search-keyword">"${keyword}"</span> 검색 결과
        </div>` : ''}
      </div>

      <div class="results-container">
        ${festivalsHTML}
      </div>
    </main>
  `;
}

// 날짜 포맷 함수
function formatDate(dateStr) {
  if (!dateStr) return '-';
  // LocalDate 형식: 2024-11-14
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// getAreaName 함수 제거 (더 이상 필요 없음)

// 검색 이벤트 리스너 설정 (페이지 로드 후)
export function setupSearchListeners() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const keyword = searchInput.value.trim();
      if (keyword) {
        window.history.pushState(null, null, `/search?q=${encodeURIComponent(keyword)}`);
        window.location.reload(); // 새로고침하여 검색 결과 표시
      }
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const keyword = searchInput.value.trim();
        if (keyword) {
          window.history.pushState(null, null, `/search?q=${encodeURIComponent(keyword)}`);
          window.location.reload();
        }
      }
    });
  }
}
