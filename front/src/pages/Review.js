// pages/ReviewPage.js
import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';
import { reviewApi } from "../api/ReviewApi.js";

// 전역 변수
let currentPage = 0;
let currentSort = 'latest';  // latest, likes, views
let currentRating = 'all';   // all, 5, 4, 3
let hasMorePages = false;

// API 베이스 URL (실제 서버 주소로 변경하세요)
const API_BASE_URL = 'http://localhost:8080'; // 또는 실제 서버 URL

export function ReviewPage() {
    requestAnimationFrame(() => {
        initializeReviewPage();
    });

    return `
    ${createHeader('reviews')}

    <main class="review-container">
      <!-- 헤더 -->
      <div class="review-header">
        <div class="header-top">
          <div class="header-title">
            <span class="header-icon">💬</span>
            <h1>축제 후기</h1>
          </div>
          <button class="write-review-btn" id="write-review-btn">
            ✍️ 후기 작성하기
          </button>
        </div>
        <p class="header-subtitle">리뷰 <span id="total-reviews">0</span>개 · 생생한 축제 경험담</p>
      </div>

      <!-- 필터 섹션 -->
      <div class="filter-section">
<!--        <div class="filter-row">-->
<!--          <span class="filter-label">정렬</span>-->
<!--          <div class="filter-buttons">-->
<!--            <button class="filter-btn active" data-sort="latest">최신순</button>-->
<!--            <button class="filter-btn" data-sort="likes">좋아요순</button>-->
<!--            <button class="filter-btn" data-sort="views">조회순</button>-->
<!--          </div>-->
<!--        </div>-->
        
<!--        <div class="divider"></div>-->
        
        <div class="filter-row">
          <span class="filter-label">평점</span>
          <div class="filter-buttons">
            <button class="filter-btn active" data-rating="all">전체</button>
            <button class="filter-btn" data-rating="5">⭐⭐⭐⭐⭐</button>
            <button class="filter-btn" data-rating="4">⭐⭐⭐⭐</button>
            <button class="filter-btn" data-rating="3">⭐⭐⭐</button>
          </div>
        </div>
      </div>

      <!-- 후기 그리드 -->
      <div class="reviews-grid" id="reviews-grid">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>후기 목록을 불러오는 중...</p>
        </div>
      </div>

      <!-- 더보기 버튼 -->
      <div class="load-more-section" id="load-more-section" style="display: none;">
        <button class="load-more-btn" id="load-more-btn">
          더 보기
        </button>
      </div>
    </main>
  `;
}

async function initializeReviewPage() {
    setupFilterButtons();
    setupWriteButton();
    await loadReviews();
    setupLoadMoreButton();
}

function setupFilterButtons() {
    // 정렬 필터
    const sortButtons = document.querySelectorAll('[data-sort]');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            sortButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentSort = btn.dataset.sort;
            currentPage = 0;
            await loadReviews();
        });
    });

    // 평점 필터
    const ratingButtons = document.querySelectorAll('[data-rating]');
    ratingButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            ratingButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentRating = btn.dataset.rating;
            currentPage = 0;
            await loadReviews();
        });
    });
}

function setupWriteButton() {
    const writeBtn = document.getElementById('write-review-btn');
    if (writeBtn) {
        writeBtn.addEventListener('click', () => {
            window.router.navigate('/reviews/write');
        });
    }
}

function setupLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            currentPage++;
            await loadReviews(true);
        });
    }
}

async function loadReviews(append = false) {
    const gridElement = document.getElementById('reviews-grid');
    const loadMoreSection = document.getElementById('load-more-section');

    try {
        // 로딩 표시
        if (!append) {
            gridElement.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>후기 목록을 불러오는 중...</p>
                </div>
            `;
        }

        let ratingParam = null;
        if (currentRating && currentRating !== 'all') {
            ratingParam = parseInt(currentRating);
        }

        // API 호출
        const response = await reviewApi.getReviews(currentPage, ratingParam);

        const data = response;

        const reviews = data.content || [];
        const hasNext = data.hasNext || false;

        // 첫 페이지면 그리드 초기화
        if (!append) {
            gridElement.innerHTML = '';
        }

        // 후기 카드 렌더링
        if (reviews.length > 0) {
            reviews.forEach(review => {
                const card = createReviewCard(review);
                gridElement.insertAdjacentHTML('beforeend', card);
            });

            // 더보기 버튼 표시 여부
            hasMorePages = hasNext;
            loadMoreSection.style.display = hasNext ? 'flex' : 'none';
        } else if (!append) {
            gridElement.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>작성된 후기가 없습니다</h3>
                    <p>첫 번째 후기를 작성해보세요!</p>
                </div>
            `;
            loadMoreSection.style.display = 'none';
        }

    } catch (error) {
        console.error('Error loading reviews:', error);
        if (!append) {
            gridElement.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">⚠️</div>
                    <h3>오류가 발생했습니다</h3>
                    <p>후기 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.</p>
                </div>
            `;
        }
    }
}

function createReviewCard(review) {
    const stars = renderStars(review.rating);

    // 이미지 URL을 절대 경로로 변환
    const imageUrls = review.images?.map(img => {
        const url = img.url || img.imageUrl || img.src;
        // 상대 경로면 API_BASE_URL을 붙임
        return url.startsWith('http')
            ? url
            : `${API_BASE_URL}/api${url}`;
    }) || [];

    const images = imageUrls.length > 0
        ? createImagePreview(imageUrls)
        : '';

    const cleanTitle = review.title.replace(/^"|"$/g, '');
    const cleanContent = review.content.replace(/^"|"$/g, '');

    const formattedDate = new Date(review.createdDate).toLocaleDateString('ko-KR');

    return `
    <div class="review-card" style="cursor: pointer;" 
         onclick="window.router.navigate('/reviews/detail?id=${review.reviewId}')">
      <div class="review-card-header">
        <div class="festival-info-review">
          <div class="festival-name">${review.festivalName}</div>
          <div class="festival-meta-review">
            <span class="region-badge">${review.region}</span>
            <span class="category-badge">${review.festivalCategory}</span>
          </div>
        </div>
        <div class="rating-stars">
          ${stars}
        </div>
      </div>
      
      <h3 class="review-title">${cleanTitle}</h3>
      
      <p class="review-content">${cleanContent}</p>
      
      ${images}
      
      <div class="review-footer">
        <div class="author-info">
          <span class="author-name">${review.authorName}</span>
          <span class="review-date">${formattedDate}</span>
        </div>
      </div>
    </div>
  `;
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star">★</span>';
        } else {
            stars += '<span class="star empty">★</span>';
        }
    }
    return stars;
}

function createImagePreview(images) {
    if (!images || images.length === 0) return '';

    const maxShow = 3;
    const remaining = images.length - maxShow;

    let html = '<div class="review-images">';

    for (let i = 0; i < Math.min(maxShow, images.length); i++) {
        html += `<div class="image-preview" style="background-image: url('${images[i]}')"></div>`;
    }

    if (remaining > 0) {
        html += `<div class="more-images">+${remaining}</div>`;
    }

    html += '</div>';
    return html;
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num;
}

// Export
export { loadReviews };