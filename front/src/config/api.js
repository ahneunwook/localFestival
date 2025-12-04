// API 기본 URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Refresh Token 갱신 중인지 체크 (중복 방지)
let isRefreshing = false;
let refreshSubscribers = [];

/**
 * 토큰 갱신 대기 중인 요청들을 처리
 */
function onRefreshed(newToken) {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
}

/**
 * 토큰 갱신 대기열에 추가
 */
function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

/**
 * 공통 API 요청 함수 (Refresh Token 자동 갱신 포함)
 * @param {string} endpoint - API 엔드포인트 (예: '/festivals')
 * @param {object} options - fetch options
 * @returns {Promise<any>} - API 응답 데이터
 */
export async function apiFetch(endpoint, options = {}) {
  // 무한 루프 방지: 인증 관련 API는 토큰 갱신 로직 스킵
  const skipRefresh = endpoint.includes('/auth/login') || 
                      endpoint.includes('/auth/signup') || 
                      endpoint.includes('/auth/refresh');

  // 1. 토큰 가져오기
  let token = localStorage.getItem('accessToken');
  
  // Bearer 접두사 제거
  if (token?.startsWith('Bearer ')) {
    token = token.substring(7);
  }

  // 2. 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // 3. 토큰이 있으면 Authorization 헤더 추가
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // 4. fetch 요청
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Refresh Token 쿠키 전송
  });
  
  // 5. 401 에러 & Refresh Token 갱신 로직
  if (response.status === 401 && !skipRefresh) {
    // 이미 토큰 갱신 중이면 대기
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((newToken) => {
          // 갱신된 토큰으로 재요청
          headers['Authorization'] = `Bearer ${newToken}`;
          fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
          })
            .then(res => {
              if (!res.ok) {
                return res.json().then(err => reject(err));
              }
              return res.json().then(data => resolve(data.data || data));
            })
            .catch(reject);
        });
      });
    }

    // 토큰 갱신 시작
    isRefreshing = true;

    try {
      // Refresh Token API 직접 호출
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!refreshResponse.ok) {
        throw new Error('토큰 갱신 실패');
      }

      const refreshData = await refreshResponse.json();
      let newToken = refreshData.data?.accessToken;

      // Bearer 접두사 제거
      if (newToken?.startsWith('Bearer ')) {
        newToken = newToken.substring(7);
      }

      // 새 토큰 저장
      localStorage.setItem('accessToken', newToken);

      // 대기 중인 요청들에게 새 토큰 전달
      onRefreshed(newToken);

      // 원래 요청 재시도
      headers['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
      });

    } catch (refreshError) {
      console.error('Refresh Token 갱신 실패:', refreshError);
      
      // 로그아웃 처리
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      
      throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
    } finally {
      isRefreshing = false;
    }
  }

  // 6. 일반 에러 처리
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API Error: ${response.status}`);
  }
  
  // 7. JSON 응답 반환
  const data = await response.json();
  return data.data || data; // BaseResponse 구조를 고려하여 data 필드 반환
}

/**
 * 로딩 상태와 함께 API 요청 (선택적)
 */
export async function apiFetchWithLoading(endpoint, options = {}) {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'block';
  
  try {
    const result = await apiFetch(endpoint, options);
    return result;
  } finally {
    if (loadingEl) loadingEl.style.display = 'none';
  }
}
