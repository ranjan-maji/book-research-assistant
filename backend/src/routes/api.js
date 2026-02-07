const express = require('express');
const router = express.Router();
const SearchService = require('../services/searchService');

// Create service instance
const searchService = new SearchService();

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Book Research API is working!',
    version: '1.0.0',
    endpoints: {
      search: 'POST /api/search',
      test: 'GET /api/test',
      health: 'GET /health'
    },
    timestamp: new Date().toISOString()
  });
});

// Main search endpoint
router.post('/search', async (req, res) => {
  try {
    const bookParams = req.body;
    
    // Validate input
    if (!bookParams || typeof bookParams !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
        message: 'Please provide valid book parameters'
      });
    }

    if (!bookParams.topic || !bookParams.title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['title', 'topic'],
        received: Object.keys(bookParams)
      });
    }

    console.log('🔍 Received search request:', {
      title: bookParams.title,
      topic: bookParams.topic,
      author: bookParams.author || 'Not specified',
      year: bookParams.year || 'Not specified',
      maxResults: bookParams.maxResults || 10
    });

    // Process search
    const results = await searchService.searchResearchMaterials(bookParams);
    
    // Prepare response
    const response = {
      success: true,
      count: results.length,
      results: results,
      metadata: {
        searchedAt: new Date().toISOString(),
        query: `${bookParams.title} - ${bookParams.topic}`,
        sourceCount: results.reduce((acc, curr) => {
          acc[curr.source] = (acc[curr.source] || 0) + 1;
          return acc;
        }, {}),
        hasMockData: results.some(r => r.isMock)
      }
    };

    // Log success
    console.log(`✅ Search completed: ${results.length} results found`);
    
    res.json(response);

  } catch (error) {
    console.error('❌ Search error:', error.message);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Failed to search research materials',
      message: error.message,
      suggestion: 'Please try again with different keywords or check your internet connection'
    });
  }
});

module.exports = router;