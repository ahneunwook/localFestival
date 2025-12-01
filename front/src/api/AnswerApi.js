const API_BASE_URL = 'http://localhost:8080/api';

export const answerApi = {
    // 답글 작성
    async createAnswer(questionId, answerData){
        try{
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(answerData),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            return data.data;
        } catch (error) {
            throw error;
        }
    },

    async updateAnswer(questionId, answerId, answerData){
        try{
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answer/${answerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(answerData),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            return data.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteAnswer(questionId, answerId, answerData){
        try{
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answer/${answerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            return data.data;
        } catch (error) {
            throw error;
        }
    },

}