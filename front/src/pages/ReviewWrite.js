// pages/ReviewWritePage.js
import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';
import { reviewApi } from "../api/ReviewApi.js";

const API_BASE_URL = 'http://localhost:8080';

// 전역 변수
let selectedFestival = null;
let selectedRating = 0;
let uploadedImages = []; // 새로 추가할 이미지들
let existingImages = []; // 기존 이미지들 (수정 모드에서만)
let isEditMode = false;
let targetReviewId = null;
let deletedImageIds = [];

export function ReviewWritePage() {
    const urlParams = new URLSearchParams(window.location.search);
    targetReviewId = urlParams.get('id');
    isEditMode = !!targetReviewId;

    requestAnimationFrame(() => {
        initializeWritePage();
    });

    return `
    ${createHeader('reviews')}

    <main class="write-review-container">
      <div class="write-header">
        <a href="/reviews" class="back-button-write">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>후기 목록</span>
        </a>
        <h1 class="write-title">
            ${isEditMode ? '✍️ 후기 수정하기' : '✍️ 축제 후기 작성'}
        </h1>
        <p class="write-subtitle">
            ${isEditMode ? '작성했던 후기를 수정합니다.' : '다녀온 축제의 생생한 후기를 공유해주세요'}
        </p>
      </div>

      <div class="write-form-card">
        <form id="review-form">
          <div class="form-group">
            <label class="form-label form-label-required">
              <span class="label-icon">🎪</span>
              어떤 축제에 다녀오셨나요?
            </label>
            <div class="festival-select-box" id="festival-select-box">
              <button type="button" class="festival-select-btn" id="festival-select-btn">
                <span class="select-placeholder">축제를 선택해주세요</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              
              <div class="festival-dropdown" id="festival-dropdown" style="display: none;">
                <div class="dropdown-search">
                  <input type="text" id="festival-search" placeholder="축제 이름으로 검색..." />
                </div>
                <div class="dropdown-list" id="festival-list">
                  <div class="loading-spinner-small">
                    <div class="spinner-small"></div>
                    <p>축제 목록을 불러오는 중...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label form-label-required">
              <span class="label-icon">⭐</span>
              축제는 어떠셨나요?
            </label>
            <div class="rating-select">
              <button type="button" class="rating-star" data-rating="1">★</button>
              <button type="button" class="rating-star" data-rating="2">★</button>
              <button type="button" class="rating-star" data-rating="3">★</button>
              <button type="button" class="rating-star" data-rating="4">★</button>
              <button type="button" class="rating-star" data-rating="5">★</button>
              <span class="rating-text" id="rating-text">별점을 선택해주세요</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label form-label-required" for="review-title">
              <span class="label-icon">📝</span>
              후기 제목
            </label>
            <input 
              type="text" 
              id="review-title" 
              class="form-input" 
              placeholder="예) 정말 환상적인 빛의 향연이었어요!"
              maxlength="100"
            />
            <div class="char-count">
              <span id="title-count">0</span> / 100
            </div>
          </div>

          <div class="form-group">
            <label class="form-label form-label-required" for="review-content">
              <span class="label-icon">✏️</span>
              후기 내용
            </label>
            <textarea 
              id="review-content" 
              class="form-textarea" 
              placeholder="축제의 분위기, 프로그램, 음식, 교통편 등 자유롭게 작성해주세요. (최소 50자)"
              maxlength="2000"
            ></textarea>
            <div class="char-count">
              <span id="content-count">0</span> / 2000
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📷</span>
              사진 추가 (선택)
            </label>
            
            ${isEditMode ? '<p style="font-size: 0.9em; color: #666; margin-bottom: 8px;">※ 기존 사진을 삭제하려면 X 버튼을 누르세요. 새 사진을 추가할 수도 있습니다.</p>' : ''}

            <div class="image-upload-area">
              <!-- 기존 이미지 미리보기 (수정 모드에서만 표시) -->
              <div id="existing-images-container" style="display: none;">
                <h4 style="font-size: 14px; color: #666; margin-bottom: 12px;">기존 사진</h4>
                <div class="image-preview-grid" id="existing-images-grid"></div>
              </div>

              <!-- 새로 추가할 이미지 -->
              <div id="new-images-section">
                ${isEditMode ? '<h4 style="font-size: 14px; color: #666; margin: 16px 0 12px;">새 사진 추가</h4>' : ''}
                
                <input 
                  type="file" 
                  id="image-upload" 
                  accept="image/*" 
                  multiple 
                  style="display: none;"
                />
                <button type="button" class="upload-trigger-btn" id="upload-trigger-btn">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p>사진을 선택하거나 드래그해서 업로드</p>
                  <span class="upload-hint">최대 10장까지 업로드 가능</span>
                </button>
                
                <div class="image-preview-grid" id="image-preview-grid" style="display: none;"></div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" id="cancel-btn">취소</button>
            <button type="submit" class="btn-submit" id="submit-btn">
              <span>${isEditMode ? '수정 완료' : '후기 작성 완료'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  `;
}

async function initializeWritePage() {
    // 변수 초기화
    selectedFestival = null;
    selectedRating = 0;
    uploadedImages = [];
    existingImages = [];
    deletedImageIds = [];

    setupFestivalSelect();
    setupRatingSelect();
    setupImageUpload();
    setupCharCount();
    setupFormSubmit();
    setupCancelButton();

    if (isEditMode && targetReviewId) {
        await loadExistingReviewData(targetReviewId);
    } else {
        await loadFestivalList();
    }
}

// ⭐ 기존 데이터 불러오기 (이미지 포함)
async function loadExistingReviewData(id) {
    try {
        const data = await reviewApi.getReviewDetail(id);

        // 제목, 내용
        document.getElementById('review-title').value = data.title.replace(/^"|"$/g, '');
        document.getElementById('review-content').value = data.content.replace(/^"|"$/g, '');
        document.getElementById('title-count').textContent = data.title.replace(/^"|"$/g, '').length;
        document.getElementById('content-count').textContent = data.content.replace(/^"|"$/g, '').length;

        // 축제 정보
        selectedFestival = {
            id: data.festivalId,
            name: data.festivalName
        };
        const selectBtn = document.getElementById('festival-select-btn');
        selectBtn.querySelector('.select-placeholder').textContent = data.festivalName;
        selectBtn.classList.add('selected');

        // 평점
        selectedRating = data.rating;
        const ratingTexts = {
            1: '별로예요 😞',
            2: '그저 그래요 😐',
            3: '괜찮아요 😊',
            4: '좋아요! 😄',
            5: '최고예요! 🤩'
        };
        document.getElementById('rating-text').textContent = ratingTexts[selectedRating] || '별점을 선택해주세요';
        updateStarDisplay(selectedRating);

        // ⭐ 기존 이미지 처리
        if (data.images && data.images.length > 0) {
            existingImages = data.images.map(img => {
                const url = img.url || img.imageUrl || img.src;
                const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}/api${url}`;
                return {
                    id: img.id || null, // 이미지 ID (삭제할 때 필요)
                    url: fullUrl,
                    isExisting: true // 기존 이미지 표시
                };
            });

            renderExistingImages();
        }

    } catch (error) {
        console.error("데이터 로드 실패", error);
        alert("기존 글 정보를 불러오지 못했습니다.");
        window.history.back();
    }
}

// ⭐ 기존 이미지 렌더링
function renderExistingImages() {
    const container = document.getElementById('existing-images-container');
    const grid = document.getElementById('existing-images-grid');

    if (existingImages.length > 0) {
        container.style.display = 'block';
        grid.style.display = 'grid';

        grid.innerHTML = existingImages.map((img, idx) => `
            <div class="image-preview-item" data-type="existing">
                <img src="${img.url}" alt="기존 이미지">
                <button type="button" class="image-remove-btn" data-index="${idx}" data-type="existing">
                    ✕
                </button>
                <div class="image-label">기존</div>
            </div>
        `).join('');

        // 삭제 버튼 이벤트
        grid.querySelectorAll('.image-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                const targetImage = existingImages[idx];
                if (targetImage && targetImage.id) {
                    deletedImageIds.push(targetImage.id);
                }

                existingImages.splice(idx, 1);
                renderExistingImages();
            });
        });
    } else {
        container.style.display = 'none';
    }
}

async function loadFestivalList() {
    try {
        const response = await festivalApi.searchFestivalsByTitle(' ');
        renderFestivalList(response || []);
    } catch (error) {
        console.error(error);
    }
}

async function searchFestivals(keyword) {
    try {
        const response = await festivalApi.searchFestivalsByTitle(keyword);
        renderFestivalList(response || []);
    } catch (error) {
        console.error(error);
    }
}

function renderFestivalList(festivals) {
    const listElement = document.getElementById('festival-list');
    if (festivals.length === 0) {
        listElement.innerHTML = `<div class="dropdown-empty"><p>결과가 없습니다</p></div>`;
        return;
    }
    listElement.innerHTML = festivals.map(f => `
        <div class="festival-item" data-id="${f.id}" data-name="${f.name}">
            <div class="festival-item-name">${f.name}</div>
        </div>
    `).join('');
}

function setupFestivalSelect() {
    const selectBtn = document.getElementById('festival-select-btn');
    const dropdown = document.getElementById('festival-dropdown');
    const searchInput = document.getElementById('festival-search');

    selectBtn.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        if(dropdown.style.display === 'block') searchInput.focus();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('#festival-select-box')) dropdown.style.display = 'none';
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchFestivals(e.target.value.trim());
        }, 300);
    });

    document.getElementById('festival-list').addEventListener('click', (e) => {
        const item = e.target.closest('.festival-item');
        if (!item) return;
        selectedFestival = { id: item.dataset.id, name: item.dataset.name };
        selectBtn.querySelector('.select-placeholder').textContent = item.dataset.name;
        selectBtn.classList.add('selected');
        dropdown.style.display = 'none';
    });
}

function setupRatingSelect() {
    const stars = document.querySelectorAll('.rating-star');
    const ratingTexts = {
        1: '별로예요 😞',
        2: '그저 그래요 😐',
        3: '괜찮아요 😊',
        4: '좋아요! 😄',
        5: '최고예요! 🤩'
    };

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            document.getElementById('rating-text').textContent = ratingTexts[selectedRating];
            updateStarDisplay(selectedRating);
        });
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            updateStarDisplay(rating);
        });
    });

    document.querySelector('.rating-select').addEventListener('mouseleave', () => {
        updateStarDisplay(selectedRating);
    });
}

function updateStarDisplay(rating) {
    document.querySelectorAll('.rating-star').forEach((star, idx) => {
        if(idx < rating) star.classList.add('active');
        else star.classList.remove('active');
    });
}

function setupImageUpload() {
    const uploadInput = document.getElementById('image-upload');
    const uploadBtn = document.getElementById('upload-trigger-btn');
    const uploadArea = uploadBtn.parentElement;

    uploadBtn.addEventListener('click', () => uploadInput.click());
    uploadInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // 드래그 앤 드롭
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e5e7eb';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#e5e7eb';
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const totalImages = existingImages.length + uploadedImages.length;
    const remaining = 10 - totalImages;

    if (remaining <= 0) {
        alert('최대 10장까지만 업로드할 수 있습니다.');
        return;
    }

    const filesToAdd = Array.from(files).slice(0, remaining);

    filesToAdd.forEach(file => {
        if (!file.type.startsWith('image/')) {
            alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push({
                file: file,
                url: e.target.result,
                isExisting: false
            });
            renderNewImagePreviews();
        };
        reader.readAsDataURL(file);
    });
}

// ⭐ 새로 추가한 이미지 렌더링
function renderNewImagePreviews() {
    const previewGrid = document.getElementById('image-preview-grid');
    const uploadBtn = document.getElementById('upload-trigger-btn');

    if (uploadedImages.length > 0) {
        previewGrid.style.display = 'grid';
        uploadBtn.style.display = 'none';

        previewGrid.innerHTML = uploadedImages.map((img, idx) => `
            <div class="image-preview-item" data-type="new">
                <img src="${img.url}" alt="새 이미지">
                <button type="button" class="image-remove-btn" data-index="${idx}" data-type="new">
                    ✕
                </button>
                <div class="image-label" style="background: #10b981;">새 사진</div>
            </div>
        `).join('');

        // 삭제 이벤트
        previewGrid.querySelectorAll('.image-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                uploadedImages.splice(idx, 1);
                renderNewImagePreviews();
            });
        });
    } else {
        previewGrid.style.display = 'none';
        uploadBtn.style.display = 'flex';
    }
}

function setupCharCount() {
    document.getElementById('review-title').addEventListener('input', function() {
        document.getElementById('title-count').textContent = this.value.length;
    });
    document.getElementById('review-content').addEventListener('input', function() {
        document.getElementById('content-count').textContent = this.value.length;
    });
}

function setupFormSubmit() {
    const form = document.getElementById('review-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectedFestival || selectedRating === 0) {
            alert('필수 항목을 입력해주세요.');
            return;
        }

        const title = document.getElementById('review-title').value.trim();
        const content = document.getElementById('review-content').value.trim();

        if (!title || content.length < 50) {
            alert('내용을 50자 이상 입력해주세요.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('rating', selectedRating);
            formData.append('title', title);
            formData.append('content', content);
            formData.append('festivalId', selectedFestival.id);

            // 새로 추가된 이미지만 전송
            uploadedImages.forEach(img => {
                formData.append('images', img.file);
            });


            if (deletedImageIds.length > 0) {
                deletedImageIds.forEach(id => {
                    formData.append('deleteImageIds', id);
                });
            }

            if (isEditMode) {
                await reviewApi.updateReview(targetReviewId, formData);
                alert('수정되었습니다!');
                window.location.href = `/reviews/detail?id=${targetReviewId}`;
            } else {
                await reviewApi.createReview(formData);
                alert('작성되었습니다!');
                window.location.href = '/reviews';
            }

        } catch (error) {
            console.error('Error:', error);
            alert('작업에 실패했습니다.');
        }
    });
}

function setupCancelButton() {
    document.getElementById('cancel-btn').addEventListener('click', () => {
        if (confirm('작성을 취소하시겠습니까?')) {
            window.history.back();
        }
    });
}