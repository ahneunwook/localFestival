import { API_BASE_URL } from '../config/api.js';

export const authApi = {
    // 회원가입
    async signUp(signupRequest) {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupRequest)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || '회원가입 실패');
        }

        return await response.json();
    },

    // 로그인
    async login(loginRequest) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(loginRequest)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || '로그인 실패');
        }

        return await response.json();
    },

    // Refresh Token으로 Access Token 갱신
    async refresh() {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // Refresh Token은 HttpOnly 쿠키로 전송
        });

        if (!response.ok) {
            throw new Error('토큰 갱신 실패');
        }

        const data = await response.json();

        // 새 Access Token 저장
        if (data.data?.accessToken) {
            localStorage.setItem('accessToken', data.data.accessToken);
        }

        return data;
    },

    async logout() {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('토큰 갱신 실패');
        }

        // 서버에서 String 응답이므로 JSON이 아니라 text()로 받아야 함
        const message = await response.text();

        // accessToken 제거
        localStorage.removeItem('accessToken');

        return message;
    }
}
