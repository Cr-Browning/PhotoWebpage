const express = require('express');
const router = express.Router();
const { fetchInstagramMedia, clearInstagramCache } = require('../services/instagramService');

/**
 * GET /api/instagram/media
 * Fetch Instagram media
 */
router.get('/media', async (req, res) => {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return res.status(500).json({ 
        success: false, 
        message: 'Instagram access token not configured' 
      });
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit) : 12;
    const media = await fetchInstagramMedia(accessToken, limit);
    
    res.json({ 
      success: true, 
      data: media 
    });
  } catch (error) {
    console.error('Instagram media fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch Instagram media' 
    });
  }
});

/**
 * POST /api/instagram/clear-cache
 * Clear Instagram media cache
 */
router.post('/clear-cache', (req, res) => {
  try {
    clearInstagramCache();
    res.json({ 
      success: true, 
      message: 'Instagram cache cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing Instagram cache:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to clear Instagram cache' 
    });
  }
});

module.exports = router; 