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
    async getReviews(page = 0) {
        let url = `/reviews?page=${page}`;

        return await apiFetch(url);
    },

    // 후기 조회
    async getReviewDetail(reviewId) {
        let url = `/reviews/${reviewId}`;

        return await apiFetch(url);
    }
}
