// pages/ReviewWritePage.js
import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';
import {reviewApi} from "../api/ReviewApi.js";

// 전역 변수
let selectedFestival = null;
let selectedRating = 0;
let uploadedImages = [];

export function ReviewWritePage() {
    requestAnimationFrame(() => {
        initializeWritePage();
    });

    return `
    ${createHeader('reviews')}

    <main class="write-review-container">
      <!-- 헤더 -->
      <div class="write-header">
        <a href="/reviews" class="back-button-write">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>후기 목록</span>
        </a>
        <h1 class="write-title">✍️ 축제 후기 작성</h1>
        <p class="write-subtitle">다녀온 축제의 생생한 후기를 공유해주세요</p>
      </div>

      <!-- 작성 폼 -->
      <div class="write-form-card">
        <form id="review-form">
          <!-- 축제 선택 -->
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
              
              <!-- 드롭다운 -->
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

          <!-- 평점 -->
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

          <!-- 제목 -->
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

          <!-- 내용 -->
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

          <!-- 사진 업로드 -->
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📷</span>
              사진 추가 (선택)
            </label>
            <div class="image-upload-area">
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
              
              <div class="image-preview-grid" id="image-preview-grid" style="display: none;">
                <!-- 업로드된 이미지 미리보기 -->
              </div>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="form-actions">
            <button type="button" class="btn-cancel" id="cancel-btn">취소</button>
            <button type="submit" class="btn-submit" id="submit-btn">
              <span>후기 작성 완료</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </main>
  `;
}

async function initializeWritePage() {
    await loadFestivalList();
    setupFestivalSelect();
    setupRatingSelect();
    setupImageUpload();
    setupCharCount();
    setupFormSubmit();
    setupCancelButton();
}

// 축제 목록 불러오기
async function loadFestivalList() {
    try {
        const response = await festivalApi.searchFestivalsByTitle(' ');
        const festivals = response || [];
        console.log(festivals);
        renderFestivalList(festivals);
    } catch (error) {
        console.error('Error loading festivals:', error);
        document.getElementById('festival-list').innerHTML = `
            <div class="dropdown-error">
                <p>축제 목록을 불러오는데 실패했습니다</p>
            </div>
        `;
    }
}

async function searchFestivals(keyword) {
    try {
        const response = await festivalApi.searchFestivalsByTitle(keyword);
        const festivals = response || [];
        renderFestivalList(festivals);
    } catch (error) {
        console.error('Error searching festivals:', error);
        document.getElementById('festival-list').innerHTML = `
            <div class="dropdown-error">
                <p>검색에 실패했습니다</p>
            </div>
        `;
    }
}

function renderFestivalList(festivals) {
    const listElement = document.getElementById('festival-list');

    if (festivals.length === 0) {
        listElement.innerHTML = `
            <div class="dropdown-empty">
                <p>진행 중인 축제가 없습니다</p>
            </div>
        `;
        return;
    }

    listElement.innerHTML = festivals.map(festival => `
        <div class="festival-item" data-id="${festival.id}" data-name="${festival.name}">
            <div class="festival-item-info">
                <div class="festival-item-name">${festival.name}</div>
            </div>
        </div>
    `).join('');
}

// 축제 선택 드롭다운
function setupFestivalSelect() {
    const selectBtn = document.getElementById('festival-select-btn');
    const dropdown = document.getElementById('festival-dropdown');
    const searchInput = document.getElementById('festival-search');

    // 드롭다운 토글
    selectBtn.addEventListener('click', () => {
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) {
            searchInput.focus();
        }
    });

    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#festival-select-box')) {
            dropdown.style.display = 'none';
        }
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.trim();

        // 디바운싱: 300ms 후에 검색
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchFestivals(keyword);
        }, 300);
    });

    // 축제 선택
    document.getElementById('festival-list').addEventListener('click', (e) => {
        const item = e.target.closest('.festival-item');
        if (!item) return;

        selectedFestival = {
            id: item.dataset.id,
            name: item.dataset.name
        };

        selectBtn.querySelector('.select-placeholder').textContent = item.dataset.name;
        selectBtn.classList.add('selected');
        dropdown.style.display = 'none';

        // 다른 항목 선택 해제
        document.querySelectorAll('.festival-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
    });
}

// 별점 선택
function setupRatingSelect() {
    const stars = document.querySelectorAll('.rating-star');
    const ratingText = document.getElementById('rating-text');

    const ratingTexts = {
        1: '별로예요 😞',
        2: '그저 그래요 😐',
        3: '괜찮아요 😊',
        4: '좋아요! 😄',
        5: '최고예요! 🤩'
    };

    stars.forEach(star => {
        // 호버
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            updateStarDisplay(rating);
        });

        // 클릭
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            ratingText.textContent = ratingTexts[selectedRating];
            ratingText.style.color = '#667eea';
        });
    });

    // 마우스 나갈 때 선택된 별점 유지
    document.querySelector('.rating-select').addEventListener('mouseleave', () => {
        updateStarDisplay(selectedRating);
    });
}

function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// 이미지 업로드
function setupImageUpload() {
    const uploadInput = document.getElementById('image-upload');
    const uploadBtn = document.getElementById('upload-trigger-btn');
    const previewGrid = document.getElementById('image-preview-grid');

    // 버튼 클릭
    uploadBtn.addEventListener('click', () => {
        uploadInput.click();
    });

    // 파일 선택
    uploadInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // 드래그 앤 드롭
    uploadBtn.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBtn.classList.add('dragover');
    });

    uploadBtn.addEventListener('dragleave', () => {
        uploadBtn.classList.remove('dragover');
    });

    uploadBtn.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBtn.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const previewGrid = document.getElementById('image-preview-grid');
    const uploadBtn = document.getElementById('upload-trigger-btn');

    Array.from(files).forEach(file => {
        if (uploadedImages.length >= 10) {
            alert('최대 10장까지만 업로드 가능합니다.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImages.push({
                file: file,
                url: e.target.result
            });

            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    });
}

function renderImagePreviews() {
    const previewGrid = document.getElementById('image-preview-grid');
    const uploadBtn = document.getElementById('upload-trigger-btn');

    if (uploadedImages.length === 0) {
        previewGrid.style.display = 'none';
        uploadBtn.style.display = 'flex';
        return;
    }

    previewGrid.style.display = 'grid';
    uploadBtn.style.display = 'none';

    previewGrid.innerHTML = uploadedImages.map((img, index) => `
        <div class="image-preview-item">
            <img src="${img.url}" alt="Preview ${index + 1}" />
            <button type="button" class="image-remove-btn" data-index="${index}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');

    // 삭제 버튼
    document.querySelectorAll('.image-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            uploadedImages.splice(index, 1);
            renderImagePreviews();
        });
    });

    // 추가 업로드 버튼
    if (uploadedImages.length < 10) {
        previewGrid.insertAdjacentHTML('beforeend', `
            <div class="image-add-more">
                <button type="button" id="add-more-btn">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <p>${uploadedImages.length} / 10</p>
                </button>
            </div>
        `);

        document.getElementById('add-more-btn').addEventListener('click', () => {
            document.getElementById('image-upload').click();
        });
    }
}

// 글자 수 카운트
function setupCharCount() {
    const titleInput = document.getElementById('review-title');
    const contentTextarea = document.getElementById('review-content');
    const titleCount = document.getElementById('title-count');
    const contentCount = document.getElementById('content-count');

    titleInput.addEventListener('input', () => {
        titleCount.textContent = titleInput.value.length;
    });

    contentTextarea.addEventListener('input', () => {
        contentCount.textContent = contentTextarea.value.length;
    });
}

// 폼 제출
function setupFormSubmit() {
    const form = document.getElementById('review-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!selectedFestival) {
            alert('축제를 선택해주세요.');
            return;
        }

        if (selectedRating === 0) {
            alert('별점을 선택해주세요.');
            return;
        }

        const title = document.getElementById('review-title').value.trim();
        if (!title) {
            alert('제목을 입력해주세요.');
            return;
        }

        const content = document.getElementById('review-content').value.trim();
        if (!content) {
            alert('내용을 입력해주세요.');
            return;
        }

        if (content.length < 50) {
            alert('내용을 50자 이상 작성해주세요.');
            return;
        }

        // 제출
        try {
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>작성 중...</span>';

            const formData = new FormData();
            formData.append('festivalId', selectedFestival.id);
            formData.append('rating', selectedRating);
            formData.append('title', title);
            formData.append('content', content);

            uploadedImages.forEach((img, index) => {
                formData.append('images', img.file);
            });

            await reviewApi.createReview(formData);

            alert('후기가 작성되었습니다!');
            window.location.href = '/reviews';

        } catch (error) {
            console.error('Error submitting review:', error);
            alert('후기 작성에 실패했습니다. 다시 시도해주세요.');

            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>후기 작성 완료</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            `;
        }
    });
}

// 취소 버튼
function setupCancelButton() {
    const cancelBtn = document.getElementById('cancel-btn');

    cancelBtn.addEventListener('click', () => {
        if (confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
            window.history.back();
        }
    });
}

// Export
export { initializeWritePage };