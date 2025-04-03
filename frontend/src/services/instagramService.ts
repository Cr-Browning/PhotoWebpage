// Define the Instagram media item interface
export interface InstagramMedia {
  id: string;
  title: string;
  category: string;
  image: string;
  permalink: string;
  timestamp: string;
}

// API base URL - adjust this based on your environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Fetch Instagram media from the backend
 * @param limit - Number of media items to fetch
 * @returns Promise with Instagram media data
 */
export const fetchInstagramMedia = async (limit = 12): Promise<InstagramMedia[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/instagram/media?limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch Instagram media');
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching Instagram media:', error);
    return [];
  }
};

/**
 * Clear the Instagram media cache on the backend
 * @returns Promise with success status
 */
export const clearInstagramCache = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/instagram/clear-cache`, {
      method: 'POST',
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error clearing Instagram cache:', error);
    return false;
  }
}; 