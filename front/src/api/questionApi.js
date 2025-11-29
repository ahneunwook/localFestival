import {fetchWithAuth} from "./FetchWithAuth.js";

const API_BASE_URL = 'http://localhost:8080/api';

export const questionApi = {

    // 문의 생성
    async createQuestion(questionData) {
        try {
            const data = await fetchWithAuth('/questions', {
                method: 'POST',
                body: JSON.stringify(questionData),
            });
            return data.data;
        } catch (error) {
            if (error.message === '로그인 필요') {
                alert("로그인이 필요합니다.");
                return;
            }
            throw error;
        }
    },

    async openQuestionModal() {
        try {
            const data = await fetchWithAuth('/questions/users/me');

            document.getElementById("name").value = data.data.userName;
            document.getElementById("email").value = data.data.email;
            document.getElementById("writeModal").classList.add("active");

            return data.data;
        } catch (error) {
            if (error.message === '로그인 필요') {
                alert("로그인이 필요합니다.");
                return;
            }
            throw error;
        }
    },

    async getQuestionList(){
        try {
            const response = await fetch(`${API_BASE_URL}/questions`);

            const data = await response.json();
            if (!response.ok){
                throw new Error(data.message);
            }
            return data.data;
        } catch (error){
            throw error;
        }
    },

    async getQuestionDetail(id){
        try {
            const response = await fetch(`${API_BASE_URL}/questions/${id}`);

            const data = await response.json();
            if (!response.ok){
                throw new Error(data.message);
            }
            return data.data;
        } catch (error){
            throw error;
        }
    },

    async updateQuestion(id, questionData) {
        try {
            const data = await fetchWithAuth(`/questions/${id}`, {
                method: 'PUT',
                body: JSON.stringify(questionData),
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    },

    async deleteQuestion(id) {
        try {
            const data = await fetchWithAuth(`/questions/${id}`, {
                method: 'DELETE',
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    }
}
