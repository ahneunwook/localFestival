import { apiFetch } from '../config/api.js';

export const answerApi = {
    // 답글 작성
    async createAnswer(questionId, answerData) {
        return await apiFetch(`/questions/${questionId}/answer`, {
            method: 'POST',
            body: JSON.stringify(answerData)
        });
    },

    // 답글 수정
    async updateAnswer(questionId, answerId, answerData) {
        return await apiFetch(`/questions/${questionId}/answer/${answerId}`, {
            method: 'PATCH',
            body: JSON.stringify(answerData)
        });
    },

    // 답글 삭제
    async deleteAnswer(questionId, answerId) {
        return await apiFetch(`/questions/${questionId}/answer/${answerId}`, {
            method: 'DELETE'
        });
    }
}
