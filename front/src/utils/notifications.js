import { API_BASE_URL } from '../config/api.js';

let eventSource = null;
let isConnecting = false;
let reconnectAttempts = 0;
let shouldStopReconnect = false;
const MAX_RECONNECT_ATTEMPTS = 3;

/**
 * SSE 연결 초기화
 */
export function initNotifications() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return;
  }

  // 재연결이 차단된 상태면 리턴
  if (shouldStopReconnect) {
    return;
  }

  // 연결 시도 중이면 바로 리턴
  if (isConnecting) {
      return;
  }

  // 이미 연결되어 있으면 중복 연결 방지
  if (eventSource) {
	eventSource.close();
	eventSource = null;
  }

  isConnecting = true
  	
  // Bearer 제거
  const cleanToken = token.replace(/^Bearer\s*/i, '').trim();

  // Query Parameter로 토큰 전달
  eventSource = new EventSource(`${API_BASE_URL}/sse/subscribe?token=${cleanToken}`);

  // 연결 성공
  eventSource.addEventListener('connected', (event) => {
	isConnecting = false;
	reconnectAttempts = 0; // 성공 시 재연결 카운터 리셋
  });

  // 중요 공지 알림
  eventSource.addEventListener('important-news', (event) => {
    const data = JSON.parse(event.data);
    showNotification(data);
  });

  // 연결 에러
  eventSource.onerror = async (error) => {
    // EventSource 연결 닫기 (브라우저 자동 재연결 방지)
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    isConnecting = false;

    // 재연결이 차단된 상태면 더 이상 시도하지 않음
    if (shouldStopReconnect) {
      return;
    }

    // 토큰 유효성 체크
    const token = localStorage.getItem('accessToken');

    if (!token) {
      shouldStopReconnect = true;
      reconnectAttempts = 0;
      return;
    }

    // 재연결 시도 횟수 체크
    reconnectAttempts++;
    if (reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
      // 토큰 갱신 시도
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const newToken = data.data?.accessToken || data.accessToken;

          if (newToken) {
            // Bearer 제거 후 저장
            const cleanNewToken = newToken.replace(/^Bearer\s*/i, '').trim();
            localStorage.setItem('accessToken', cleanNewToken);
            reconnectAttempts = 0;
            setTimeout(() => initNotifications(), 1000);
          } else {
            throw new Error('새 토큰을 받지 못했습니다');
          }
        } else {
          // refresh 토큰도 만료된 경우 - 재연결 중단 및 로그인 페이지로 이동
          shouldStopReconnect = true;
          reconnectAttempts = 0;
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          return;
        }
      } catch (err) {
        // 토큰 갱신 실패 시 재연결 중단 및 로그인 페이지로 이동
        shouldStopReconnect = true;
        reconnectAttempts = 0;
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return;
      }
      return;
    }

    // 네트워크 에러 - 5초 후 재연결
    setTimeout(() => {
      initNotifications();
    }, 5000);
  };
}

/**
 * SSE 연결 종료
 */
export function closeNotifications() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  reconnectAttempts = 0;
  shouldStopReconnect = false;
}

/**
 * 알림 팝업 표시
 */
function showNotification(data) {
  // 알림 컨테이너 생성 (없으면)
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }

  // 알림 요소 생성
  const notification = document.createElement('div');
  notification.className = 'notification-popup';
  notification.innerHTML = `
    <div class="notification-header">
      <span class="notification-icon">🔔</span>
      <strong>${data.title}</strong>
      <button class="notification-close">&times;</button>
    </div>
    <p class="notification-message">${data.message}</p>
    <button class="notification-link" data-news-id="${data.newsId}">
      자세히 보기 →
    </button>
  `;

  container.appendChild(notification);

  // 애니메이션 트리거
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // 자세히 보기 버튼
  const linkBtn = notification.querySelector('.notification-link');
  linkBtn.addEventListener('click', () => {
    const newsId = linkBtn.dataset.newsId;
    // SPA 라우팅으로 이동
    history.pushState(null, '', `/news?id=${newsId}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    removeNotification(notification);
  });

  // 닫기 버튼
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    removeNotification(notification);
  });


  // 5초 후 자동 제거
  setTimeout(() => {
    removeNotification(notification);
  }, 5000);
}

/**
 * 알림 제거 (애니메이션 포함)
 */
function removeNotification(notification) {
  notification.classList.remove('show');
  notification.classList.add('hide');

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 300);
}