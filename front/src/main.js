import './styles/common.css'
import './styles/home.css'
import './styles/festival-list.css'
import './styles/login.css'
import Router from './router/index.js'
import { HomePage } from './pages/Home.js'
import { FestivalListPage } from './pages/FestivalList.js'
import { LoginPage } from './pages/Login.js'
import { SignupPage } from './pages/Signup.js'

// 라우트 정의
const routes = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/festivals',
    component: FestivalListPage
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
