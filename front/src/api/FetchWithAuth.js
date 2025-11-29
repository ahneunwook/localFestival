const API_BASE_URL = 'http://localhost:8080/api';

export async function fetchWithAuth(endpoint, options = {}) {
    let accessToken = localStorage.getItem('accessToken');

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
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!refreshResponse.ok) {
            localStorage.removeItem('accessToken');
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            window.location.href = '/pages/login/login.html';
            throw new Error('로그인 필요');
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.data.accessToken;

        // 새 accessToken 저장
        localStorage.setItem('accessToken', newAccessToken);

        // 재요청
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...defaultHeaders,
                'Authorization': `Bearer ${newAccessToken}`,
                ...(options.headers || {})
            },
            credentials: 'include',
        });
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
