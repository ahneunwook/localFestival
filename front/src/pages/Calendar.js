import { createHeader } from '../components/header.js';
import { festivalApi } from '../api/FestivalApi.js';
import { getCategoryColor } from '../utils/festivalHelpers.js';

let calendar = null;
let allFestivals = [];

export function CalendarPage() {
  return `
    ${createHeader('calendar')}
    
    <main class="calendar-container">
      <div class="calendar-header">
        <h1 class="calendar-title">축제 캘린더 📅</h1>
        <p class="calendar-subtitle">달력을 클릭하거나 축제를 클릭해보세요</p>
      </div>

      <div id="calendar"></div>

      <!-- 선택된 날짜의 축제 목록 -->
      <div class="selected-festivals" id="selected-festivals" style="display: none;">
        <div class="selected-festivals-header">
          <h2 class="selected-date-title" id="selected-date-title"></h2>
          <button class="close-btn" id="close-festivals">✕</button>
        </div>
        <div class="festivals-grid" id="festivals-grid"></div>
      </div>
    </main>
  `;
}

export async function setupCalendarListeners() {
  // FullCalendar 스크립트 로드
  await loadFullCalendar();
  
  // 캘린더 초기화
  initCalendar();
  
  // 닫기 버튼 이벤트
  const closeBtn = document.getElementById('close-festivals');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      document.getElementById('selected-festivals').style.display = 'none';
    });
  }
}

// FullCalendar 라이브러리 동적 로드
async function loadFullCalendar() {
  return new Promise((resolve, reject) => {
    // CSS 로드
    if (!document.getElementById('fullcalendar-css')) {
      const link = document.createElement('link');
      link.id = 'fullcalendar-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css';
      document.head.appendChild(link);
    }
    
    // JS 로드
    if (window.FullCalendar) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('FullCalendar 로드 실패'));
    document.head.appendChild(script);
  });
}

// 캘린더 초기화
async function initCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  // 현재 달의 축제 데이터 로드
  const now = new Date();
  await loadMonthFestivals(now.getFullYear(), now.getMonth());

  // FullCalendar 인스턴스 생성
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'ko',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    buttonText: {
      today: '오늘',
      month: '월',
      week: '주'
    },
    height: 'auto',
    events: allFestivals.map(festivalToEvent),
    
    // 날짜 클릭 시
    dateClick: function(info) {
      showFestivalsForDate(info.dateStr);
    },
    
    // 이벤트(축제) 클릭 시
    eventClick: function(info) {
      info.jsEvent.preventDefault();
      const festivalId = info.event.id;
      window.location.href = `/festival/detail?id=${festivalId}`;
    },
    
    // 월 변경 시
    datesSet: async function(info) {
      const startDate = info.start;
      await loadMonthFestivals(startDate.getFullYear(), startDate.getMonth());
      calendar.removeAllEvents();
      calendar.addEventSource(allFestivals.map(festivalToEvent));
    },
    
    // 이벤트 렌더링 커스터마이징
    eventContent: function(arg) {
      return {
        html: `
          <div class="fc-event-main-frame">
            <div class="fc-event-title-container">
              <div class="fc-event-title fc-sticky">${arg.event.title}</div>
            </div>
          </div>
        `
      };
    }
  });

  calendar.render();
}

// 월별 축제 데이터 로드
async function loadMonthFestivals(year, month) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  const startStr = formatDateForApi(startDate);
  const endStr = formatDateForApi(endDate);
  
  try {
    const festivals = await festivalApi.getFestivalsByMonth(startStr, endStr);
    allFestivals = festivals || [];
  } catch (error) {
    console.error('축제 데이터 로드 실패:', error);
    allFestivals = [];
  }
}

// 축제 데이터를 FullCalendar 이벤트 형식으로 변환
function festivalToEvent(festival) {
  return {
    id: festival.id,
    title: festival.title,
    start: festival.startDate,
    end: addOneDay(festival.endDate), // FullCalendar는 end를 exclusive로 처리
    backgroundColor: getCategoryColor(festival.category),
    borderColor: getCategoryColor(festival.category),
    textColor: '#ffffff',
    extendedProps: {
      festival: festival
    }
  };
}

// 카테고리별 색상 (하늘색 계열로 통일)
// 특정 날짜의 축제 표시
function showFestivalsForDate(dateStr) {
  const festivals = allFestivals.filter(festival => {
    const start = festival.startDate.split('T')[0];
    const end = festival.endDate.split('T')[0];
    return dateStr >= start && dateStr <= end;
  });

  const selectedDiv = document.getElementById('selected-festivals');
  const titleEl = document.getElementById('selected-date-title');
  const gridEl = document.getElementById('festivals-grid');

  if (!selectedDiv || !titleEl || !gridEl) return;

  const date = new Date(dateStr);
  const displayDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;

  if (festivals.length === 0) {
    titleEl.textContent = `${displayDate}에 진행되는 축제가 없습니다`;
    gridEl.innerHTML = '';
    selectedDiv.style.display = 'block';
    return;
  }

  titleEl.textContent = `${displayDate}의 축제 (${festivals.length}개)`;
  
  const festivalsHTML = festivals.map(festival => `
    <a href="/festival/detail?id=${festival.id}" class="festival-card">
      <div class="festival-image" style="background: ${getCategoryColor(festival.category)}">
        ${festival.imageUrl ? 
          `<img src="${festival.imageUrl}" alt="${festival.title}">` :
          `<div class="festival-placeholder">🎪</div>`
        }
      </div>
      <div class="festival-info">
        <span class="festival-category" style="background: ${getCategoryColor(festival.category)}">${festival.category || '기타'}</span>
        <h3 class="festival-name">${festival.title}</h3>
        <p class="festival-location">📍 ${festival.address || festival.region || '정보 없음'}</p>
        <p class="festival-period">📅 ${formatDisplayDate(festival.startDate)} ~ ${formatDisplayDate(festival.endDate)}</p>
      </div>
    </a>
  `).join('');

  gridEl.innerHTML = festivalsHTML;
  selectedDiv.style.display = 'block';
  
  // 부드럽게 스크롤
  selectedDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 날짜 포맷 함수들
function formatDateForApi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '정보 없음';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function addOneDay(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return formatDateForApi(date);
}
