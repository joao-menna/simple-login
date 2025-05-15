class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';

  private constructor() {
    this.loadToken();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadToken() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (token && expiry) {
      const expiryTime = parseInt(expiry);
      if (Date.now() < expiryTime) {
        this.token = token;
      } else {
        this.clearToken();
      }
    }
  }

  setToken(token: string) {
    this.token = token;
    const expiryTime = Date.now() + (60 * 60 * 1000);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  getToken(): string | null {
    if (this.token) {
      const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (expiry && Date.now() > parseInt(expiry)) {
        this.clearToken();
        return null;
      }
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isTokenExpiringSoon(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    
    const expiryTime = parseInt(expiry);
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() + fiveMinutes > expiryTime;
  }
}

export const authService = AuthService.getInstance(); 