const API_BASE_URL = 'http://localhost:8080/api';

export const newsApi = {
  // 공지사항 목록 조회
  async getNewsList(page = 0, size = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/news?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.data || { content: [], totalPages: 0 };
    } catch (error) {
      console.error('Failed to fetch news list:', error);
      throw error;
    }
  },

  // 공지사항 상세 조회
  async getNewsDetail(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch news detail:', error);
      throw error;
    }
  },

  // 공지사항 생성
  async createNews(newsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to create news:', error);
      throw error;
    }
  },

  // 공지사항 수정
  async updateNews(id, newsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to update news:', error);
      throw error;
    }
  },

  // 공지사항 삭제
  async deleteNews(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to delete news:', error);
      throw error;
    }
  }
};
