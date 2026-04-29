// Authentication Module
class AuthManager {
  constructor() {
    this.user = this.loadUser();
    this.token = localStorage.getItem('token');
  }

  loadUser() {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  }

  async register(email, password, name) {
    try {
      const response = await api.register(email, password, name);
      this.setUser(response.user, response.token);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await api.login(email, password);
      this.setUser(response.user, response.token);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  setUser(user, token) {
    this.user = user;
    this.token = token;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    api.setToken(token);
    this.notifyListeners();
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    api.setToken(null);
    this.notifyListeners();
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  getUser() {
    return this.user;
  }

  // Observer pattern for UI updates
  listeners = [];

  subscribe(callback) {
    this.listeners.push(callback);
    // Immediately call with current state
    callback(this.user);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.user));
  }
}

export const auth = new AuthManager();
