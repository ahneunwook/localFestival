import { closeNotifications } from '../utils/notifications.js'
import { authApi } from '../api/AuthApi.js'

// Simple SPA Router
class Router {
	constructor(routes) {
		this.routes = routes;
		this.currentRoute = null;

		// 뒤로가기/앞으로가기 처리
		window.addEventListener('popstate', () => {
			this.loadRoute(window.location.pathname);
		});

		// 링크 클릭 이벤트 처리
		document.addEventListener('click', (e) => {
			if (e.target.matches('[data-link]')) {
				e.preventDefault();
				this.navigate(e.target.getAttribute('href'));
			}
		});
	}

	navigate(path) {
		window.history.pushState(null, null, path);
		this.loadRoute(path);
	}

	async loadRoute(path) {
		// 라우트 찾기
		const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '*');

		if (route) {
			this.currentRoute = route;
			const app = document.querySelector('#app');

			// 객체/문자열 처리
			const result = await route.component();
			app.innerHTML = typeof result === 'string' ? result : result.html;
			this.afterRender();
		}
	}

	afterRender() {
		// 로그아웃 버튼 이벤트 등록
		const logoutBtn = document.getElementById("logoutBtn");
		if (logoutBtn) {
			logoutBtn.onclick = async () => {

				try {
					await authApi.logout();  // 서버에서 refreshToken 삭제 + 쿠키 삭제
				} catch (e) {
					console.error("로그아웃 실패:", e);
				}
				closeNotifications();
				window.location.href = "/";
			};
		}
	}

	init() {
		this.loadRoute(window.location.pathname || '/');
	}
}

export default Router;
