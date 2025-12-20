// pages/ReviewDetailPage.js
import { createHeader } from '../components/header.js';
import { reviewApi } from "../api/ReviewApi.js";

const API_BASE_URL = 'http://localhost:8080';

export function ReviewDetailPage(params) {
    const urlParams = new URLSearchParams(window.location.search);
    const reviewId = urlParams.get('id');

    if (!reviewId) {
        alert("잘못된 접근입니다.");
        window.history.back();
        return '';
    }

    requestAnimationFrame(() => {
        loadReviewDetail(reviewId);
    });

    return `
    ${createHeader('reviews')}

    <main class="detail-container">
        <div id="detail-loading" class="loading-spinner">
            <div class="spinner"></div>
            <p>후기를 불러오는 중입니다...</p>
        </div>

        <article id="review-content" class="review-article" style="display: none;">
            
            <div class="article-header">
                <button id="back-btn" class="back-btn">← 목록으로</button>
                <div class="festival-badge-group">
                    <span id="detail-region" class="region-badge">지역</span>
                    <span id="detail-category" class="category-badge">카테고리</span>
                    <span id="detail-festival-name" class="festival-name-tag">축제명</span>
                </div>
            </div>

            <div class="article-title-section">
                <h1 id="detail-title">제목이 들어갑니다</h1>
                <div class="meta-info">
                    <div class="author-profile">
                        <div class="avatar-placeholder">👤</div>
                        <span id="detail-author">작성자</span>
                    </div>
                    <span class="separator">·</span>
                    <span id="detail-date">2025. 12. 19</span>
                    <span class="separator">·</span>
                    <div id="detail-rating" class="stars"></div>
                </div>
            </div>

            <div id="detail-images" class="article-gallery"></div>

            <div class="article-body">
                <p id="detail-desc">내용이 들어갑니다.</p>
            </div>

            <div class="article-footer">
                <button class="like-btn">
                    ❤️ 좋아요 <span id="detail-likes">0</span>
                </button>
                <div class="owner-buttons" id="owner-buttons" style="display: none;">
                    <button class="edit-btn">수정</button>
                    <button class="delete-btn">삭제</button>
                </div>
            </div>
        </article>
    </main>
    `;
}

async function loadReviewDetail(id) {
    const loadingEl = document.getElementById('detail-loading');
    const contentEl = document.getElementById('review-content');

    try {
        const data = await reviewApi.getReviewDetail(id);

        // 데이터 바인딩
        document.getElementById('detail-title').textContent = data.title.replace(/^"|"$/g, '');
        document.getElementById('detail-desc').innerText = data.content.replace(/^"|"$/g, ''); // innerText로 줄바꿈 유지
        document.getElementById('detail-author').textContent = data.authorName;
        document.getElementById('detail-date').textContent = new Date(data.createdDate).toLocaleDateString('ko-KR');
        document.getElementById('detail-festival-name').textContent = data.festivalName;
        document.getElementById('detail-region').textContent = data.region || '지역';
        document.getElementById('detail-category').textContent = data.festivalCategory || '축제';

        // 평점 렌더링
        document.getElementById('detail-rating').innerHTML = renderStars(data.rating);

        // 이미지 렌더링
        const imageContainer = document.getElementById('detail-images');
        if (data.images && data.images.length > 0) {
            data.images.forEach(img => {
                const url = img.url || img.imageUrl || img.src;
                const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}/api${url}`;

                const imgEl = document.createElement('img');
                imgEl.src = fullUrl;
                imgEl.alt = '리뷰 이미지';
                imgEl.className = 'detail-image';
                imageContainer.appendChild(imgEl);
            });
        } else {
            imageContainer.style.display = 'none';
        }

        // 뒤로가기 버튼 이벤트
        document.getElementById('back-btn').addEventListener('click', () => {
            // SPA 라우팅 방식에 따라 history.back() 또는 라우터 이동 사용
            window.history.back();
        });

        // 로딩 제거 및 컨텐츠 표시
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';

    } catch (error) {
        console.error(error);
        loadingEl.innerHTML = `<p class="error">내용을 불러올 수 없습니다. :(</p>`;
    }
}

// 별점 렌더링 함수 (ReviewPage.js 재사용)
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<span class="star filled">★</span>' : '<span class="star empty">★</span>';
    }
    return stars;
}