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
                throw data;
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
                body: JSON.stringify(loginRequest)
            });

            const data = await response.json();

            if (!response.ok){
                throw data;
            }
            return data;
        } catch (error){
            throw error;
        }
    }
}