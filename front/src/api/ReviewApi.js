import { apiFetch } from '../config/api.js';

export const reviewApi = {
    // 후기 작성
    async createReview(formData) {
        return await apiFetch('/reviews', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
    },

    // 후기 조회
    async getReviews(page = 0, rating = null) {
        let url = `/reviews?page=${page}`;

        // rating 값이 있을 때만 URL 뒤에 붙여줌
        if (rating) {
            url += `&rating=${rating}`;
        }

        return await apiFetch(url);
    },

    // 후기 조회
    async getReviewDetail(reviewId) {
        let url = `/reviews/${reviewId}`;

        return await apiFetch(url);
    },

    async updateReview(reviewId, formData) {
        return await apiFetch(`/reviews/${reviewId}`, {
            method: 'PUT',
            body: formData,
            credentials: 'include'
        });
    },

    async deleteReview(reviewId) {
        return await apiFetch(`/reviews/${reviewId}`, {
            method: 'DELETE',
        });
    }
}
