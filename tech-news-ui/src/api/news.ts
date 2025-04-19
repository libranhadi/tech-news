import apiClient from './client';

const url = "/news"


export const getNews = async (typeData: string, page: number, limit: number, signal?: AbortSignal) => {
  try {
    const getNewsListURL = `${url}?type=${typeData}&page=${page}&limit=${limit}`;
    return await apiClient.get(getNewsListURL, { signal });
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error; 
  }
};


export const getNewsItem = async (id: number) => {
  return apiClient.get(`/news/${id}`);
};