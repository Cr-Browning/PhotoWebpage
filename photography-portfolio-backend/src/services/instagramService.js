const axios = require('axios');
const NodeCache = require('node-cache');

// Cache Instagram data for 1 hour to avoid rate limits
const instagramCache = new NodeCache({ stdTTL: 3600 });

// Instagram API configuration
const INSTAGRAM_API_URL = 'https://graph.instagram.com';
const CACHE_KEY = 'instagram_media';

/**
 * Fetch media from Instagram using the Instagram Basic Display API
 * @param {string} accessToken - Instagram access token
 * @param {number} limit - Number of media items to fetch
 * @returns {Promise<Array>} - Array of media objects
 */
async function fetchInstagramMedia(accessToken, limit = 12) {
  // Check if data is in cache
  const cachedData = instagramCache.get(CACHE_KEY);
  if (cachedData) {
    console.log('Returning Instagram media from cache');
    return cachedData;
  }

  try {
    console.log('Fetching Instagram media from API');
    
    // Fetch user media
    const response = await axios.get(`${INSTAGRAM_API_URL}/me/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username',
        access_token: accessToken,
        limit: limit
      }
    });

    const media = response.data.data;
    
    // Process media to match our gallery format
    const processedMedia = media
      .filter(item => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM')
      .map((item, index) => {
        // Determine category based on caption (if available)
        let category = 'Portrait'; // Default category
        const caption = item.caption ? item.caption.toLowerCase() : '';
        
        if (caption.includes('#portrait')) {
          category = 'Portrait';
        } else if (caption.includes('#automotive')) {
          category = 'Automotive';
        } else if (caption.includes('#fitness')) {
          category = 'Fitness';
        } else if (caption.includes('#sports')) {
          category = 'Sports';
        }
        
        return {
          id: item.id,
          title: item.caption ? item.caption.split('\n')[0].substring(0, 30) + '...' : `Instagram Photo ${index + 1}`,
          category: category,
          image: item.media_url,
          permalink: item.permalink,
          timestamp: item.timestamp
        };
      });
    
    // Store in cache
    instagramCache.set(CACHE_KEY, processedMedia);
    
    return processedMedia;
  } catch (error) {
    console.error('Error fetching Instagram media:', error.response?.data || error.message);
    throw new Error('Failed to fetch Instagram media');
  }
}

/**
 * Clear the Instagram media cache
 */
function clearInstagramCache() {
  instagramCache.del(CACHE_KEY);
  console.log('Instagram cache cleared');
}

module.exports = {
  fetchInstagramMedia,
  clearInstagramCache
}; 