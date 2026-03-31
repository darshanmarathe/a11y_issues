const API_BASE = '/api';

/**
 * API Service for CRUD operations
 */
export class ApiService {
  /**
   * Fetch data from API
   * @param {string} endpoint
   * @returns {Promise<any>}
   */
  async fetch(endpoint) {
    const url = `${API_BASE}${endpoint}`;
    console.log('API Fetch:', url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('API Fetch Error:', error);
      throw error;
    }
  }

  /**
   * Post data to API
   * @param {string} endpoint
   * @param {any} data
   * @returns {Promise<any>}
   */
  async post(endpoint, data) {
    const url = `${API_BASE}${endpoint}`;
    console.log('API Post:', url, data);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('API Post Error:', error);
      throw error;
    }
  }

  /**
   * Put data to API
   * @param {string} endpoint
   * @param {any} data
   * @returns {Promise<any>}
   */
  async put(endpoint, data) {
    const url = `${API_BASE}${endpoint}`;
    console.log('API Put:', url, data);
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('API Put Error:', error);
      throw error;
    }
  }

  /**
   * Delete data from API
   * @param {string} endpoint
   * @returns {Promise<void>}
   */
  async delete(endpoint) {
    const url = `${API_BASE}${endpoint}`;
    console.log('API Delete:', url);
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('API Delete Error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
