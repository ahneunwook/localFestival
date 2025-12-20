// pages/ReviewDetailPage.js
import { createHeader } from '../components/header.js';
import { reviewApi } from "../api/ReviewApi.js";
import {getCurrentUser} from "../utils/auth.js";

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
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                    
                    <h1 id="detail-title" style="margin: 0; flex: 1;">제목 로딩 중...</h1>
                    
                    <div id="owner-buttons" style="display: flex; gap: 8px; flex-shrink: 0;">
                        <button id="edit-btn" style="display: none; padding: 4px 10px; cursor: pointer; border: 1px solid #ccc; background: #fff; border-radius: 4px;">수정</button>
                        <button id="delete-btn" style="display: none; padding: 4px 10px; cursor: pointer; border: 1px solid #ff4d4f; background: #fff; color: #ff4d4f; border-radius: 4px;">삭제</button>
                    </div>

                </div>

                <div class="meta-info" style="margin-top: 10px;">
                    <div class="author-profile">
                        <div class="avatar-placeholder">👤</div>
                        <span id="detail-author">작성자</span>
                    </div>
                    <span class="separator">·</span>
                    <span id="detail-date">YYYY. MM. DD</span>
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

        if (!data.id) {
            data.id = id;
        }

        // 데이터 바인딩
        document.getElementById('detail-title').textContent = data.title.replace(/^"|"$/g, '');
        document.getElementById('detail-desc').innerText = data.content.replace(/^"|"$/g, '');
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

        handleButtonVisibility(data);

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

function handleButtonVisibility(review) {
    // 보내주신 인증 로직 적용
    const currentUser = getCurrentUser();
    const currentUserId = currentUser?.userId ? Number(currentUser.userId) : null;
    const isAdminUser = currentUser?.userRole === "ADMIN";

    const btnGroup = document.getElementById('owner-buttons');
    const editBtn = document.getElementById('edit-btn');
    const deleteBtn = document.getElementById('delete-btn');

    // 권한 체크 (내 ID와 리뷰의 authorId 비교)
    const isOwner = currentUserId && (currentUserId === review.authorId);

    // 작성자이거나 관리자이면 버튼 보이기
    if (isOwner || isAdminUser) {
        btnGroup.style.display = 'flex'; // 버튼 그룹 컨테이너 보이기
        editBtn.style.display = 'block';
        deleteBtn.style.display = 'block';

        // 삭제 이벤트
        deleteBtn.onclick = async () => {
            if (confirm("정말로 삭제하시겠습니까?")) {
                try {
                    await reviewApi.deleteReview(review.id);
                    alert("삭제되었습니다.");
                    window.location.href = '/reviews';
                } catch (error) {
                    alert("삭제 실패");
                    console.error(error);
                }
            }
        };

        // 수정 이벤트
        editBtn.onclick = () => {
            window.location.href = `/reviews/write?id=${review.id}&mode=edit`;
        };

    } else {
        // 권한 없으면 숨기기
        btnGroup.style.display = 'none';
        editBtn.onclick = null;
        deleteBtn.onclick = null;
    }
}