/**
 * Rou-Ticker Premium - Frontend API Integration
 * Cache buster: 2026-05-11-11:56:00
 * 
 * This module handles all API communication with the backend.
 * Features:
 * - User authentication (signup/login)
 * - Habit CRUD operations
 * - Local token storage
 * - Error handling
 */

// Configuration - API Base URL (auto-detects environment)
const API_BASE_URL = (() => {
  // If we're on localhost, use local development server
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  // If we're on a Vercel domain, use the same origin (relative path)
  if (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('.vercel.sh')) {
    return window.location.origin;
  }
  // Otherwise, use the full Vercel domain (update this with your actual domain)
  return window.location.origin;
})();

/**
 * Auth Manager - Handles user authentication
 */
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('rou_token');
    const userStr = localStorage.getItem('rou_user');
    this.user = userStr && userStr !== 'undefined' ? JSON.parse(userStr) : null;
  }

  /**
   * Sign up new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password (should be hashed on frontend in production)
   * @returns {Promise} Response with token and user data
   */
  async signup(name, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Signup failed';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          // Response is not JSON, try text
          const text = await response.text();
          errorMessage = text.slice(0, 100) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      this.setToken(data.token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Log in existing user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with token and user data
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          // Response is not JSON, try text
          const text = await response.text();
          errorMessage = text.slice(0, 100) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      this.setToken(data.token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Log out user
   */
  logout() {
    localStorage.removeItem('rou_token');
    localStorage.removeItem('rou_user');
    this.token = null;
    this.user = null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  /**
   * Store token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('rou_token', token);
  }

  /**
   * Store user info
   */
  setUser(user) {
    this.user = user;
    localStorage.setItem('rou_user', JSON.stringify(user));
  }

  /**
   * Get authorization header
   */
  getAuthHeader() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}

/**
 * Habit Manager - Handles habit CRUD operations
 */
class HabitManager {
  constructor(authManager) {
    this.auth = authManager;
  }

  /**
   * Fetch all habits for the user
   * @returns {Promise<Array>} Array of habit objects
   */
  async fetchHabits() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/habits`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.auth.getAuthHeader(),
        },
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch habits';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text.slice(0, 100) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.habits || [];
    } catch (error) {
      console.error('Fetch habits error:', error);
      throw error;
    }
  }

  /**
   * Create a new habit
   * @param {string} name - Habit name
   * @param {string} description - Habit description (optional)
   * @returns {Promise} Created habit object
   */
  async createHabit(name, description = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.auth.getAuthHeader(),
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create habit';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text.slice(0, 100) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.habit;
    } catch (error) {
      console.error('Create habit error:', error);
      throw error;
    }
  }

  /**
   * Update a habit
   * @param {number} habitId - Habit ID
   * @param {string} name - New habit name
   * @param {string} description - New description
   * @returns {Promise} Updated habit object
   */
  async updateHabit(habitId, name, description = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/habits/${habitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.auth.getAuthHeader(),
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update habit';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text.slice(0, 100) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.habit;
    } catch (error) {
      console.error('Update habit error:', error);
      throw error;
    }
  }

  /**
   * Delete a habit
   * @param {number} habitId - Habit ID
   * @returns {Promise}
   */
  async deleteHabit(habitId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.auth.getAuthHeader(),
        },
      });

      if (!response.ok) {
        let errorMessage = 'Failed to delete habit';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text.slice(0, 100) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete habit error:', error);
      throw error;
    }
  }

  /**
   * Toggle habit completion for today
   * @param {number} habitId - Habit ID
   * @param {boolean} completed - Whether habit is completed
   * @param {Array} log - Completion log for the week
   * @returns {Promise} Updated response
   */
  async toggleHabitCompletion(habitId, completed, log = []) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/habits/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.auth.getAuthHeader(),
        },
        body: JSON.stringify({ habit_id: habitId, completed, log }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to toggle completion';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text.slice(0, 100) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Toggle completion error:', error);
      throw error;
    }
  }
}

// Initialize managers
try {
  const auth = new AuthManager();
  const habits = new HabitManager(auth);
  
  // Export for use in HTML
  window.rou = {
    auth,
    habits,
  };
  
  console.log('✅ Rou-Ticker API module loaded');
} catch (error) {
  console.error('❌ Failed to initialize API:', error);
  
  // Fallback: create a stub API that just redirects to login
  window.rou = {
    auth: {
      isAuthenticated: () => false,
      login: async () => { throw error; },
      signup: async () => { throw error; },
      logout: () => {},
      token: null,
      user: null,
    },
    habits: {
      fetchHabits: async () => [],
      createHabit: async () => null,
      updateHabit: async () => null,
      deleteHabit: async () => null,
      toggleHabitCompletion: async () => null,
    }
  };
}
