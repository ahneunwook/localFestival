import './styles/common.css'
import './styles/home.css'
import './styles/festival-list.css'
import './styles/login.css'
import './styles/search-result.css'
import './styles/festival-detail.css'
import './styles/question.css'
import './styles/news.css'
import './styles/notifications.css'
import './styles/region-festival.css'
import './styles/calendar.css'
import './styles/region-festival-list.css'
import './styles/reviews.css'
import Router from './router/index.js'
import { HomePage, setupHomeSearchListeners } from './pages/Home.js'
import { FestivalListPage } from './pages/FestivalList.js'
import { FestivalDetailPage, setupLikeFeature, initFestivalDetail } from './pages/FestivalDetail.js'
import {login, LoginPage} from './pages/Login.js'
import { SignupPage } from './pages/Signup.js'
import { SearchResultPage, setupSearchListeners } from './pages/SearchResult.js'
import {questionPage, questionPageInit} from "./pages/question.js";
import { NewsPage, setupNewsListeners } from './pages/News.js'
import { initNotifications, closeNotifications } from './utils/notifications.js'
import { CalendarPage, setupCalendarListeners } from './pages/Calendar.js';
import {RegionPage, setupRegionListeners} from './pages/regionFestival.js';
import { RegionPage, setupRegionListeners } from './pages/regionFestival.js';
import { RegionFestivalListPage } from './pages/RegionFestivalList.js';
import {ReviewPage} from "./pages/Review.js";
import {ReviewWritePage} from "./pages/ReviewWrite.js";


// 라우트 정의
const routes = [
  {
    path: '/',
    component: async () => {
      const html = HomePage();
      // 페이지 로드 후 이벤트 리스너 설정
      setTimeout(() => setupHomeSearchListeners(), 0);
      return html;
    }
  },
  {
    path: '/festivals',
    component: FestivalListPage
  },
  {
	path: '/festival/detail',
	component: async () => {
	  const html = await FestivalDetailPage();
	  // 페이지 로드 후 초기화
	  setTimeout(() => {
	    setupLikeFeature();
	    if (html.festival) {
	      initFestivalDetail(html.festival);
	    }
	  }, 0);
	  
	  return html;
	}
  },
  {
    path: '/search',
    component: async () => {
      const html = await SearchResultPage();
      // 페이지 로드 후 이벤트 리스너 설정
      setTimeout(() => setupSearchListeners(), 0);
      return html;
    }
  },
  {
    path: '/login',
    component: async () => {
      const html = LoginPage();
      // 페이지 로드 후 이벤트 리스너 설정
      setTimeout(() => login(), 0);
      return html;
    }
  },
  {
    path: '/signup',
    component: SignupPage
  },
  {
    path: '/news',
    component: async () => {
      const html = NewsPage();
      // 페이지 로드 후 이벤트 리스너 설정
      setTimeout(() => setupNewsListeners(), 0);
      return html;
    }
  },
  { path: '/questions',
    component: async () => {
      const html = questionPage();
      // 페이지 로드 후 이벤트 리스너 설정
      setTimeout(() => questionPageInit(), 0);
      return html;
    }
  },
  {
    path: '/festivals/regions',
    component: async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const region = urlParams.get("region");
      const status = urlParams.get("status") || 'all';
      const category = urlParams.get("category") || null;

      if (region) {
        return RegionFestivalListPage();   // 축제 리스트 페이지
      }

      const html = RegionPage();           // 지역 목록 페이지
      setTimeout(() => setupRegionListeners(), 0);
      return html;
    }
  },
  {
    path: '/calendar',
    component: async () => {
      const html = CalendarPage();
      // 페이지 로드 후 이벤트 리스너 설정
      setTimeout(() => setupCalendarListeners(), 0);
      return html;
    }
  },
  {
    path: '/reviews',
        component: async () => {
          return ReviewPage();
        }
  },
  {
    path: '/reviews/write',
    component: async () => {
      return ReviewWritePage();
    }
  },
  {
    path: '*',
    component: () => '<h1>404 - Page Not Found</h1>'
  }
];

// 라우터 초기화
const router = new Router(routes);
router.init();

// 페이지 로드 시 SSE 연결 (로그인 상태면)
const token = localStorage.getItem('accessToken');
if (token) {
  initNotifications();
}

// 로그인 시 SSE 연결
window.addEventListener('storage', (e) => {
  if (e.key === 'accessToken') {
    if (e.newValue) {
      // 로그인됨
      initNotifications();
    } else {
      // 로그아웃됨
      closeNotifications();
    }
  }
});