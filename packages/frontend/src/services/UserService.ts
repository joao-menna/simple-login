import type { User } from "../interfaces/User";
import { authService } from "./AuthService";

const baseUrl = "http://localhost:8080";
const REQUEST_TIMEOUT = 10000; 

interface ApiError extends Error {
  response: Response;
}

class UserService {
  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: "include",
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });

      if (!response.ok) {
        const error = new Error('Request failed') as ApiError;
        error.response = response;
        throw error;
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getAll() {
    const response = await this.fetchWithTimeout(`${baseUrl}/user`);
    return await response.json();
  }

  async getById(id: number) {
    const response = await this.fetchWithTimeout(`${baseUrl}/user/${id}`);
    return await response.json();
  }

  async insert(user: User) {
    const response = await this.fetchWithTimeout(`${baseUrl}/user`, {
      method: "POST",
      body: JSON.stringify(user)
    });
    return await response.json();
  }

  async update(id: number, user: User) {
    const response = await this.fetchWithTimeout(`${baseUrl}/user/${id}`, {
      method: "PUT",
      body: JSON.stringify(user)
    });
    return await response.json();
  }

  async delete(id: number) {
    const response = await this.fetchWithTimeout(`${baseUrl}/user/${id}`, {
      method: "DELETE"
    });
    return await response.json();
  }

  async login(username: string, password: string) {
    const response = await this.fetchWithTimeout(`${baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      })
    });

    const data = await response.json();
    authService.setToken(data.token);
    return data;
  }

  async logout() {
    authService.clearToken();
  }
}

export const userService = new UserService();
