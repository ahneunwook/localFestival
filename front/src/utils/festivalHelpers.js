/**
 * 축제 관련 유틸리티 함수 모음
 */

// 카테고리별 이모지 매핑
const categoryEmojis = {
  '음악': '🎵',
  '문화': '🎨',
  '예술': '🎭',
  '음식': '🍜',
  '전통': '🏮',
  '지역축제': '🌸',
  '기타': '🎪'
};

/**
 * 카테고리에 해당하는 이모지 반환
 * @param {string} category - 카테고리명
 * @returns {string} 이모지
 */
export function getCategoryEmoji(category) {
  return categoryEmojis[category] || categoryEmojis['기타'];
}

/**
 * 날짜 범위를 포맷팅 (YYYY.MM.DD - YYYY.MM.DD)
 * @param {string} startDate - 시작 날짜
 * @param {string} endDate - 종료 날짜
 * @returns {string} 포맷팅된 날짜 범위
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return '미정';
  
  const start = startDate ? formatDate(startDate) : '미정';
  const end = endDate ? formatDate(endDate) : '미정';
  
  return `${start} - ${end}`;
}

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅
 * @param {string} dateString - 날짜 문자열
 * @returns {string} 포맷팅된 날짜
 */
export function formatDate(dateString) {
  if (!dateString) return '미정';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
}

/**
 * 날짜를 M월 D일 형식으로 포맷팅 (캘린더용)
 * @param {string} dateString - 날짜 문자열
 * @returns {string} 포맷팅된 날짜
 */
export function formatDisplayDate(dateString) {
  if (!dateString) return '정보 없음';
  
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  return `${month}월 ${day}일`;
}

/**
 * 위치 정보를 포맷팅 (지역 + 장소)
 * @param {string} region - 지역명
 * @param {string} venue - 장소명
 * @returns {string} 포맷팅된 위치 정보
 */
export function formatLocation(region, venue) {
  if (!region && !venue) return '정보없음';
  if (!venue) return region;
  if (!region) return venue;
  return `${region} ${venue}`;
}

/**
 * 상태 값을 한글로 변환
 * @param {string} status - 상태 값 (SCHEDULED, ONGOING, ENDED)
 * @returns {string} 한글 상태
 */
export function getStatusText(status) {
  const statusMap = {
    'SCHEDULED': '예정',
    'ONGOING': '진행중',
    'ENDED': '종료'
  };
  return statusMap[status] || '정보없음';
}

/**
 * 상태별 CSS 클래스 반환
 * @param {string} status - 상태 값
 * @returns {string} CSS 클래스명
 */
export function getStatusClass(status) {
  const classMap = {
    'SCHEDULED': 'status-scheduled',
    'ONGOING': 'status-ongoing',
    'ENDED': 'status-ended'
  };
  return classMap[status] || '';
}

/**
 * 상태 배지 HTML 반환
 * @param {string} status - 상태 값
 * @returns {string} HTML 배지 태그
 */
export function getStatusBadge(status) {
  const badges = {
    'SCHEDULED': '<span class="badge badge-scheduled">예정</span>',
    'ONGOING': '<span class="badge badge-ongoing">진행중</span>',
    'ENDED': '<span class="badge badge-ended">종료</span>'
  };
  return badges[status] || '-';
}

/**
 * 카테고리별 색상 반환 (알록달록 버전)
 * @param {string} category - 카테고리명
 * @returns {string} 색상 코드
 */
export function getCategoryColor(category) {
  const colors = {
    '음악': '#9b59b6',     // 보라색
    '문화': '#e84393',     // 핑크색
    '예술': '#ff9595',     // 파란색
    '음식': '#ff6b6b',     // 빨간색
    '전통': '#f39c12',     // 주황색
    '지역축제': '#1abc9c', // 청록색
    '기타': '#95a5a6'      // 회색
  };
  return colors[category] || colors['기타'];
}