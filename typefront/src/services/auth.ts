import { API_PATHS, requestJson, toApiUrl } from './apiClient';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export async function register(email: string, username: string, password: string): Promise<AuthResponse> {
  return requestJson<AuthResponse>(
    toApiUrl(API_PATHS.auth.register),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    },
    'Registration failed'
  );
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  return requestJson<AuthResponse>(
    toApiUrl(API_PATHS.auth.login),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    },
    'Login failed'
  );
}

export async function getMe(token: string): Promise<{ user: User }> {
  return requestJson<{ user: User }>(
    toApiUrl(API_PATHS.me),
    { headers: { Authorization: `Bearer ${token}` } },
    'Failed to fetch user'
  );
}

export async function updateUsername(token: string, username: string): Promise<{ message: string; user: User }> {
  return requestJson<{ message: string; user: User }>(
    toApiUrl(API_PATHS.auth.updateUsername),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    },
    'Failed to update username'
  );
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  return requestJson<{ message: string }>(
    toApiUrl(API_PATHS.auth.changePassword),
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    },
    'Failed to change password'
  );
}