const API_BASE = 'http://127.0.0.1:3000';

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
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Registration failed' }));
    throw new Error(err.error || `Registration failed: ${res.status}`);
  }
  
  return res.json();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(err.error || `Login failed: ${res.status}`);
  }
  
  return res.json();
}

export async function getMe(token: string): Promise<{ user: User }> {
  const res = await fetch(`${API_BASE}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }
  
  return res.json();
}

export async function updateUsername(token: string, username: string): Promise<{ message: string; user: User }> {
  const res = await fetch(`${API_BASE}/api/auth/update-username`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to update username' }));
    throw new Error(err.error || `Failed to update username: ${res.status}`);
  }
  
  return res.json();
}