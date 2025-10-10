const app = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// ✅ Add a default route for Render's health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌾 Farmer Q&A Backend API is running successfully!',
    version: '1.0.0',
    endpoints: {
      auth: '/v1/auth',
      admin: '/v1/admin',
      profile: '/v1/profile',
      crops: '/v1/crops',
    },
  });
});

// ✅ Global 404 fallback (after all routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found!',
  });
});

// ✅ Start server
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on: http://${HOST}:${PORT}`);
});
