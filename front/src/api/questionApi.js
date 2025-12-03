import { apiFetch } from '../config/api.js';

export const questionApi = {
    // 문의 생성
    async createQuestion(questionData) {
        return await apiFetch('/questions', {
            method: 'POST',
            body: JSON.stringify(questionData)
        });
    },

    // 현재 사용자 정보 조회 (문의 작성용)
    async getCurrentUserInfo() {
        return await apiFetch('/questions/users/me');
    },

    // openQuestionModal - DOM 조작과 API 호출이 섞여 있음
    // 이 함수는 나중에 분리하는 것이 좋지만, 일단 apiFetch로 변경
    async openQuestionModal() {
        const userData = await apiFetch('/questions/users/me');
        
        document.getElementById("name").value = userData.userName;
        document.getElementById("email").value = userData.email;
        document.getElementById("writeModal").classList.add("active");
        
        return userData;
    },

    // 문의 목록 조회
    async getQuestionList() {
        return await apiFetch('/questions');
    },

    // 문의 상세 조회
    async getQuestionDetail(id) {
        return await apiFetch(`/questions/${id}`);
    },

    // 문의 수정
    async updateQuestion(id, questionData) {
        return await apiFetch(`/questions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(questionData)
        });
    },

    // 문의 삭제
    async deleteQuestion(id) {
        return await apiFetch(`/questions/${id}`, {
            method: 'DELETE'
        });
    }
}
