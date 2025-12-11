import { apiFetch } from '../config/api.js';

export const festivalApi = {
	// 전체 축제 목록 
	async getAllFestivals(page = 0) {
		return await apiFetch(`/festivals?page=${page}`);
	},

	// 카테고리별 조회 
	async getFestivalsByCategory(category, page = 0) {
		return await apiFetch(`/festivals/category/${encodeURIComponent(category)}?page=${page}`);
	},

	// 진행 중인 축제 
	async getOngoingFestivals(page = 0) {
		return await apiFetch(`/festivals/ongoing?page=${page}`);
	},

	// 예정된 축제 
	async getUpcomingFestivals(page = 0) {
		return await apiFetch(`/festivals/upcoming?page=${page}`);
	},

	// 축제 검색
	async search(searchParams) {
		const params = new URLSearchParams();
		if (searchParams.keyword) params.append('keyword', searchParams.keyword);
		if (searchParams.region) params.append('region', searchParams.region);
		if (searchParams.category) params.append('category', searchParams.category);
		
		return await apiFetch(`/festivals/search?${params.toString()}`);
	},

	// 축제 상세 조회
	async getDetail(id) {
		return await apiFetch(`/festivals/${id}`);
	},

	// 자동완성
	async autocomplete(keyword) {
		if (!keyword || keyword.trim().length < 1) {
			return [];
		}
		
		return await apiFetch(`/festivals/autocomplete?keyword=${encodeURIComponent(keyword)}`);
	},

	// 좋아요 토글 (추가/취소)
	async toggleLike(festivalId) {
		return await apiFetch(`/festivals/${festivalId}/like`, {
			method: 'POST'
		});
	},

	// 좋아요 정보 조회
	async getLikeInfo(festivalId) {
		return await apiFetch(`/festivals/${festivalId}/like`);
	},

	// 월별 축제 조회
	async getFestivalsByMonth(startDate, endDate) {
		return await apiFetch(`/festivals/month?startDate=${startDate}&endDate=${endDate}`);
	// 지역 조회
	async getRegionCount(){
		return await apiFetch(`/festivals/regions/counts`);
	},

	// 지역별 조회
	async getRegionFestival(region, page = 0, status = 'all', category = null) {
		let url = `/festivals/regions?region=${encodeURIComponent(region)}&page=${page}&status=${status}`;

		if (category) {
			url += `&category=${encodeURIComponent(category)}`;
		}

		return await apiFetch(url);
	}

}
