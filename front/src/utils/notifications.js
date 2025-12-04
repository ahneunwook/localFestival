import { API_BASE_URL } from '../config/api.js';

let eventSource = null;
let isConnecting = false;

/**
 * SSE 연결 초기화
 */
export function initNotifications() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.log('로그인 필요 - SSE 연결 안 함');
    return;
  }
  
  // 연결 시도 중이면 바로 리턴
  if (isConnecting) {
      console.log('⏳ SSE 연결 시도 중...');
      return;
  }
  
  // 이미 연결되어 있으면 중복 연결 방지
  if (eventSource) {
	eventSource.close();
	eventSource = null;
  }

  console.log('SSE 연결 시도...');
  isConnecting = true
  	
  // Bearer 제거
  const cleanToken = token.replace(/^Bearer\s*/i, '').trim();

  // Query Parameter로 토큰 전달
  eventSource = new EventSource(`${API_BASE_URL}/sse/subscribe?token=${cleanToken}`);

  // 연결 성공
  eventSource.addEventListener('connected', (event) => {
    console.log('✅ SSE 연결 성공:', event.data);
	isConnecting = false;
  });

  // 중요 공지 알림
  eventSource.addEventListener('important-news', (event) => {
    console.log('🔔 알림 수신:', event.data);
    const data = JSON.parse(event.data);
    showNotification(data);
  });

  // 연결 에러
  eventSource.onerror = (error) => {
    console.error('❌ SSE 연결 에러:', error);
    closeNotifications();
	isConnecting = false;
    // 5초 후 재연결 시도
    setTimeout(() => {
      console.log('🔄 SSE 재연결 시도...');
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
    console.log('🔌 SSE 연결 종료');
  }
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
