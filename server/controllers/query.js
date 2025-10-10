const { advisoryAI } = require('../apis');

const query = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Missing query text',
      });
    }

    // AI response generation
    const aiResponse = await advisoryAI.processFarmingQuery(query, {});

    res.json({
      success: true,
      query,
      response: aiResponse?.response || aiResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Query assistant error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to process farming query',
      details: error.message,
    });
  }
};

module.exports = { query };
