require('dotenv').config();
console.log('DEBUG OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? '✅ loaded' : '❌ missing');

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// --- CORS configuration ---
const allowedOrigins = [
  "http://localhost:5173",        // Local dev
  "https://agri-smart-six.vercel.app" // Deployed frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(cookieParser());

// --- Logging for debugging ---
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Default home route ---
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "🌾 Farmer Q&A Backend API is live and running on Render!",
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- Body parsers ---
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// --- Service worker ---
app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'service-worker.js'));
});

// --- Load all routes ---
require('./routes')(app);

module.exports = app;
