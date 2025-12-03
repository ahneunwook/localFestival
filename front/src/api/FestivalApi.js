import {fetchWithAuth} from "./FetchWithAuth.js";

const API_BASE_URL = 'http://localhost:8080/api';

export const festivalApi = {
	// 전체 축제 목록 
	async getAllFestivals(page = 0) {
	  try {
	    const response = await fetch(`${API_BASE_URL}/festivals?page=${page}`);
	    if (!response.ok) {
	      throw new Error('Network response was not ok');
	    }
	    const data = await response.json();
	    return data.data || { content: [], hasNext: false };
	  } catch (error) {
	    console.error('Failed to fetch festivals:', error);
	    throw error;
	  }
	},

	// 카테고리별 조회 
	async getFestivalsByCategory(category, page = 0) {
	  try {
	    const response = await fetch(`${API_BASE_URL}/festivals/category/${encodeURIComponent(category)}?page=${page}`);
	    if (!response.ok) {
	      throw new Error('Network response was not ok');
	    }
	    const data = await response.json();
	    return data.data || { content: [], hasNext: false };
	  } catch (error) {
	    console.error('Failed to fetch festivals by category:', error);
	    throw error;
	  }
	},

	// 진행 중인 축제 
	async getOngoingFestivals(page = 0) {
	  try {
	    const response = await fetch(`${API_BASE_URL}/festivals/ongoing?page=${page}`);
	    if (!response.ok) {
	      throw new Error('Network response was not ok');
	    }
	    const data = await response.json();
	    return data.data || { content: [], hasNext: false };
	  } catch (error) {
	    console.error('Failed to fetch ongoing festivals:', error);
	    throw error;
	  }
	},

	// 예정된 축제 
	async getUpcomingFestivals(page = 0) {
	  try {
	    const response = await fetch(`${API_BASE_URL}/festivals/upcoming?page=${page}`);
	    if (!response.ok) {
	      throw new Error('Network response was not ok');
	    }
	    const data = await response.json();
	    return data.data || { content: [], hasNext: false };
	  } catch (error) {
	    console.error('Failed to fetch upcoming festivals:', error);
	    throw error;
	  }
	},

	// 축제 검색
	async search(searchParams) {
	  try {
	    const params = new URLSearchParams();
	    if (searchParams.keyword) params.append('keyword', searchParams.keyword);
	    if (searchParams.region) params.append('region', searchParams.region);
	    if (searchParams.category) params.append('category', searchParams.category);
	    
	    const response = await fetch(`${API_BASE_URL}/festivals/search?${params.toString()}`);
	    if (!response.ok) {
	      throw new Error('Network response was not ok');
	    }
	    const data = await response.json();
	    return data.data || [];
	  } catch (error) {
	    console.error('Failed to search festivals:', error);
	    throw error;
	  }
	},

	// 축제 상세 조회
	async getDetail(id) {
	  try {
	    const response = await fetch(`${API_BASE_URL}/festivals/${id}`);
	    if (!response.ok) {
	      throw new Error('Network response was not ok');
	    }
	    const data = await response.json();
	    return data.data;
	  } catch (error) {
	    console.error('Failed to fetch festival detail:', error);
	    throw error;
	  }
	},

	// 자동완성
	async autocomplete(keyword) {
	  try {
	    if (!keyword || keyword.trim().length < 1) {
	      return [];
	    }
	    
	    const response = await fetch(`${API_BASE_URL}/festivals/autocomplete?keyword=${encodeURIComponent(keyword)}`);
	    if (!response.ok) {
	      throw new Error('Network response was not ok');
	    }
	    const data = await response.json();
	    return data.data || [];
	  } catch (error) {
	    console.error('Failed to get autocomplete suggestions:', error);
	    return [];
	  }
	},

	// 좋아요 토글 (추가/취소)
	async toggleLike(festivalId) {
	  try {

	    const response = await fetchWithAuth(`/festivals/${festivalId}/like`, {
	      method: 'POST',
	    });

	    if (!response.ok) {
	      throw new Error('좋아요 처리에 실패했습니다.');
	    }

	    const data = await response.json();
	    return data.data; // { festivalId, likeCount, isLiked }
	  } catch (error) {
	    console.error('Failed to toggle like:', error);
	    throw error;
	  }
	},

	// 좋아요 정보 조회
	async getLikeInfo(festivalId) {
	  try {
	    const token = localStorage.getItem('accessToken');
	    const headers = {};
	    if (token) {
	      headers['Authorization'] = token;
	    }

	    const response = await fetch(`${API_BASE_URL}/festivals/${festivalId}/like`, {
	      method: 'GET',
	      headers: headers
	    });

	    if (!response.ok) {
	      throw new Error('좋아요 정보 조회에 실패했습니다.');
	    }

	    const data = await response.json();
	    return data.data; // { festivalId, likeCount, isLiked }
	  } catch (error) {
	    console.error('Failed to get like info:', error);
	    throw error;
	  }
	}
}