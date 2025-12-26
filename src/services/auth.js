// src/services/auth.js
import axios from 'axios';

// ✅ Use environment variable
const API_URL = import.meta.env.VITE_API_URL || 'https://reactback-production-6cd8.up.railway.app/api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  async login(email, password) {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`, // ✅ Use the API_URL constant
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success) {
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        return { success: true, user: this.user };
      }

      return { success: false, message: response.data?.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  async verifyToken() {
    if (!this.token) return false;
    
    try {
      const response = await axios.get( // ✅ Fixed: added parentheses
        `${API_URL}/auth/verify`, // ✅ Use the API_URL constant
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        }
      );
      return response.data?.success === true;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
