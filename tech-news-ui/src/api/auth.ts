import apiClient from './client';
import { LoginCredentials, AuthResponse, UserProfile } from '../app/types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get('/auth/profile');
  return response.data.user;
};