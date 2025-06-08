import type { User } from "../contexts/AuthContext";


interface ApiError {
  error: string;
  message?: string;
  retryAfter?: string;
  details?: { field: string; message: string }[];
}

class ApiService {
  private base = 'http://localhost:3000/api';

  private async request<T>(url: string, opts: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const res = await fetch(this.base + url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...opts
    });
    const data = await res.json();
    if (!res.ok) throw data as ApiError;
    return data as T;
  }

  register(e: string, p: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: e, password: p })
    });
  }

  login(e: string, p: string) {
    return this.request<{
      requires2FA: boolean;
      token?: string;
      user?: User;
      userId?: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: e, password: p })
    });
  }

  setup2FA() {
    return this.request<{ qr: string; secret: string; message: string }>('/2fa/setup');
  }

  verify2FA(code: string) {
    return this.request('/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  complete2FALogin(userId: string, code: string) {
    return this.request<{ token: string; user: User }>('/2fa/login', {
      method: 'POST',
      body: JSON.stringify({ userId, code })
    });
  }

  getCurrentUser() {
    return this.request<{ user: User }>('/protected/me');
  }
}

export default new ApiService();
