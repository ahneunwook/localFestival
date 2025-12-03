const API_BASE_URL = 'http://localhost:8080/api';

export const authApi = {
    async signUp(signupRequest){
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupRequest)
            });
            const data = await response.json();

            if (!response.ok){
                throw new Error(data.message);
            }
            return data.data;

        } catch (error){
            throw error;
        }
    },

    async login(loginRequest) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // 쿠키 전송/저장
                body: JSON.stringify(loginRequest)
            });

            const data = await response.json();

            if (!response.ok){
                throw data;
            }

            if (data.data.accessToken) {
                let token = data.data.accessToken.trim()
                    .replace(/\s+/g, '');

                if (token.startsWith('Bearer ')) {
                    token = token.substring(7);
                }

                localStorage.setItem('accessToken', token);
            }
            return data;
        } catch (error){
            throw error;
        }
    },

    async refresh() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include', // 쿠키 자동 전송
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            // 새 Access Token 저장
            if (data.data.accessToken) {
                let token = data.data.accessToken;
                if (token.startsWith('Bearer ')) {
                    token = token.substring(7);
                }
                localStorage.setItem('accessToken', token);
            }

            return data;
        } catch (error) {
            throw error;
        }
    },
}