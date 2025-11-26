import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';

export async function FestivalDetailPage() {
  // URL에서 축제 ID 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  
  if (!id) {
    return `
      ${createHeader('detail')}
      <main class="detail-page">
        <div class="error-container">
          <h2>잘못된 접근입니다</h2>
          <p>축제 ID가 없습니다.</p>
          <a href="/" data-link class="btn-back">홈으로 돌아가기</a>
        </div>
      </main>
    `;
  }

  try {
    const festival = await festivalApi.getDetail(id);
    
    return `
      ${createHeader('detail')}
      <main class="detail-page">
        <div class="detail-container">
          <!-- 헤더 이미지 -->
          <div class="detail-header">
            ${festival.imageUrl ? 
              `<img src="${festival.imageUrl}" alt="${festival.title}" class="detail-image">` :
              `<div class="detail-image-placeholder">
                <span class="placeholder-icon">🎪</span>
              </div>`
            }
            <div class="detail-overlay">
              <div class="detail-title-section">
                <span class="detail-category">${festival.category || '기타'}</span>
                <h1 class="detail-title">${festival.title}</h1>
                <div class="detail-meta">
                  <span class="meta-item">📍 ${festival.region || '-'}</span>
                  <span class="meta-item">🎫 ${getStatusBadge(festival.eventStatus)}</span>
                  <button id="likeButton" class="like-button" data-festival-id="${festival.id}">
                    <span class="like-icon">❤️</span>
                    <span class="like-count">0</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 내용 섹션 -->
          <div class="detail-content">
            <!-- 기본 정보 -->
            <section class="info-section">
              <h2 class="section-title">📅 축제 정보</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">기간</span>
                  <span class="info-value">${formatDate(festival.startDate)} ~ ${formatDate(festival.endDate)}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">장소</span>
                  <span class="info-value">${festival.venue || '-'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">주소</span>
                  <span class="info-value">${festival.address || '-'}</span>
                </div>
                ${festival.tel ? `
                <div class="info-item">
                  <span class="info-label">문의</span>
                  <span class="info-value">${festival.tel}</span>
                </div>
                ` : ''}
              </div>
            </section>

            <!-- 상세 설명 -->
            ${festival.description ? `
            <section class="info-section">
              <h2 class="section-title">📝 축제 소개</h2>
              <div class="description-box">
                ${festival.description.replace(/\n/g, '<br>')}
              </div>
            </section>
            ` : ''}

            <!-- 주최/주관 정보 -->
            ${festival.organizer || festival.host || festival.sponsor ? `
            <section class="info-section">
              <h2 class="section-title">🏛️ 주최/주관</h2>
              <div class="info-grid">
                ${festival.organizer ? `
                <div class="info-item">
                  <span class="info-label">주최</span>
                  <span class="info-value">${festival.organizer}</span>
                </div>
                ` : ''}
                ${festival.host ? `
                <div class="info-item">
                  <span class="info-label">주관</span>
                  <span class="info-value">${festival.host}</span>
                </div>
                ` : ''}
                ${festival.sponsor ? `
                <div class="info-item">
                  <span class="info-label">후원</span>
                  <span class="info-value">${festival.sponsor}</span>
                </div>
                ` : ''}
              </div>
            </section>
            ` : ''}

            <!-- 관련 정보 -->
            ${festival.relatedInfo ? `
            <section class="info-section">
              <h2 class="section-title">ℹ️ 관련 정보</h2>
              <div class="description-box">
                ${festival.relatedInfo}
              </div>
            </section>
            ` : ''}

            <!-- 링크 버튼 -->
            <div class="action-buttons">
              ${festival.homepageUrl ? `
                <a href="${festival.homepageUrl}" target="_blank" class="btn btn-primary">
                  🌐 홈페이지 방문
                </a>
              ` : ''}
              ${festival.latitude && festival.longitude ? `
                <a href="https://map.kakao.com/link/map/${festival.title},${festival.latitude},${festival.longitude}" 
                   target="_blank" class="btn btn-secondary">
                  🗺️ 지도 보기
                </a>
              ` : ''}
              <a href="/festivals" data-link class="btn btn-outline">
                📋 목록으로
              </a>
            </div>
          </div>
        </div>
      </main>
    `;
  } catch (error) {
    console.error('축제 상세 조회 오류:', error);
    return `
      ${createHeader('detail')}
      <main class="detail-page">
        <div class="error-container">
          <h2>축제 정보를 불러올 수 없습니다</h2>
          <p>잠시 후 다시 시도해주세요.</p>
          <a href="/festivals" data-link class="btn-back">목록으로 돌아가기</a>
        </div>
      </main>
    `;
  }
}

// 날짜 포맷
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// 상태 배지
function getStatusBadge(status) {
  const badges = {
    'SCHEDULED': '<span class="badge badge-scheduled">예정</span>',
    'ONGOING': '<span class="badge badge-ongoing">진행중</span>',
    'ENDED': '<span class="badge badge-ended">종료</span>'
  };
  return badges[status] || '-';
}

// 좋아요 기능 초기화
export async function setupLikeFeature() {
  const likeButton = document.getElementById('likeButton');
  
  if (!likeButton) return;

  const festivalId = likeButton.dataset.festivalId;

  // 좋아요 정보 로드
  try {
    const likeInfo = await festivalApi.getLikeInfo(festivalId);
    updateLikeButton(likeButton, likeInfo);
  } catch (error) {
    console.error('좋아요 정보 로드 실패:', error);
  }

  // 좋아요 버튼 클릭 이벤트
  likeButton.addEventListener('click', async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login';
        return;
      }

      likeButton.disabled = true;
      const likeInfo = await festivalApi.toggleLike(festivalId);
      updateLikeButton(likeButton, likeInfo);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert(error.message || '좋아요 처리에 실패했습니다.');
    } finally {
      likeButton.disabled = false;
    }
  });
}

// 좋아요 버튼 UI 업데이트
function updateLikeButton(button, likeInfo) {
  const likeCountEl = button.querySelector('.like-count');
  
  if (likeInfo.isLiked) {
    button.classList.add('liked');
  } else {
    button.classList.remove('liked');
  }
  
  likeCountEl.textContent = likeInfo.likeCount;
}
