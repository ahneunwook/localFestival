import { authApi } from './authApi.js';

const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchWithAuth(endpoint, options = {}) {
    let accessToken = localStorage.getItem('accessToken');

    if (accessToken?.startsWith('Bearer')) {
        accessToken = accessToken.substring(6).trim();
    }

    // 요청 기본 설정
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    };

    // 1차 요청
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        },
        credentials: 'include',
    });

    // Access Token 만료
    if (response.status === 401) {
        try {
            const refreshData = await authApi.refresh();
            let newAccessToken = refreshData.data.accessToken;

            if (newAccessToken?.startsWith('Bearer ')) {
                newAccessToken = newAccessToken.substring(7);
            }

            const retryHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${newAccessToken}`,
                ...Object.fromEntries(
                    Object.entries(options.headers || {})
                        .filter(([key]) => key.toLowerCase() !== 'authorization')
                )
            };

            // 재요청
            response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: retryHeaders,
                credentials: 'include',
            });


        } catch (refreshError) {
            console.error('Refresh Token 만료 또는 실패:', refreshError);

            // Refresh Token도 만료됨
            localStorage.removeItem('accessToken');
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/login';
            throw new Error('로그인 필요');
        }
    }

    // 비어있는 body 방지
    let data;
    try {
        data = await response.json();
    } catch (e) {
        data = {};
    }

    if (!response.ok) throw data;
    return data;
}
