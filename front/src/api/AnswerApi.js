import {fetchWithAuth} from "./FetchWithAuth.js";

const API_BASE_URL = 'http://localhost:8080/api';

export const answerApi = {
    // 답글 작성
    async createAnswer(questionId, answerData) {
        try {
            const data = await fetchWithAuth(`/questions/${questionId}/answer`, {
                method: 'POST',
                body: JSON.stringify(answerData),
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    },

    async updateAnswer(questionId, answerId, answerData) {
        try {
            const data = await fetchWithAuth(`/questions/${questionId}/answer/${answerId}`, {
                method: 'PATCH',
                body: JSON.stringify(answerData),
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteAnswer(questionId, answerId) {
        try {
            const data = await fetchWithAuth(`/questions/${questionId}/answer/${answerId}`, {
                method: 'DELETE',
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    },

}