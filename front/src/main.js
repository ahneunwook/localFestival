import './styles/common.css'
import './styles/home.css'
import './styles/festival-list.css'
import './styles/login.css'
import './styles/search-result.css'
import './styles/festival-detail.css'
import Router from './router/index.js'
import { HomePage, setupHomeSearchListeners } from './pages/Home.js'
import { FestivalListPage } from './pages/FestivalList.js'
import { FestivalDetailPage } from './pages/FestivalDetail.js'
import { LoginPage } from './pages/Login.js'
import { SignupPage } from './pages/Signup.js'
import { SearchResultPage, setupSearchListeners } from './pages/SearchResult.js'

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
    component: FestivalDetailPage
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
    component: LoginPage
  },
  {
    path: '/signup',
    component: SignupPage
  },
  {
    path: '*',
    component: () => '<h1>404 - Page Not Found</h1>'
  }
];

// 라우터 초기화
const router = new Router(routes);
router.init();
