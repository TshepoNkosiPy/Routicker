/**
 * Rou-Ticker Premium - Frontend API Integration
 * 
 * This module handles all API communication with the backend.
 * Features:
 * - User authentication (signup/login)
 * - Habit CRUD operations
 * - Local token storage
 * - Error handling
 */

// Configuration - API Base URL (change to your Vercel domain in production)
const API_BASE_URL = 'http://localhost:3000';

/**
 * Auth Manager - Handles user authentication
 */
class AuthManager {
  constructor() {
    this.token = localStorage.getItem('rou_token');
    this.user = JSON.parse(localStorage.getItem('rou_user') || 'null');
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
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
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
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
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
        throw new Error('Failed to fetch habits');
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
        const error = await response.json();
        throw new Error(error.error || 'Failed to create habit');
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
        throw new Error('Failed to update habit');
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
        throw new Error('Failed to delete habit');
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
   * @returns {Promise} Updated habit and completion log
   */
  async toggleHabitCompletion(habitId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/habits/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.auth.getAuthHeader(),
        },
        body: JSON.stringify({ habit_id: habitId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to toggle completion');
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
const auth = new AuthManager();
const habits = new HabitManager(auth);

// Export for use in HTML
window.rou = {
  auth,
  habits,
};

console.log('✅ Rou-Ticker API module loaded');
