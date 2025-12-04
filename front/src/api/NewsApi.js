import { apiFetch } from '../config/api.js';

export const newsApi = {
  // 공지사항 목록 조회
  async getNewsList(page = 0, size = 10) {
    return await apiFetch(`/news?page=${page}&size=${size}`);
  },

  // 공지사항 상세 조회
  async getNewsDetail(id) {
    return await apiFetch(`/news/${id}`);
  },

  // 공지사항 생성 (ADMIN만 가능)
  async createNews(newsData) {
    return await apiFetch('/news', {
      method: 'POST',
      body: JSON.stringify(newsData)
    });
  },

  // 공지사항 수정 (ADMIN만 가능)
  async updateNews(id, newsData) {
    return await apiFetch(`/news/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(newsData)
    });
  },

  // 공지사항 삭제 (ADMIN만 가능)
  async deleteNews(id) {
    return await apiFetch(`/news/${id}`, {
      method: 'DELETE'
    });
  }
};
