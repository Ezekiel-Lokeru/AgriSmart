require('dotenv').config();
console.log('DEBUG OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? '✅ loaded' : '❌ missing');
console.log('DEBUG (first 6 chars):', (process.env.OPENWEATHER_API_KEY || '').slice(0,6).replace(/./g, '*'));

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require("cors");

const app = express();

// --- CORS configuration ---
let corsOptions = {
  origin: [
    `http://localhost:${process.env['PORT']}`,
    `https://192.168.68.21:${process.env['PORT']}`,
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(cookieParser());

// --- Health check route ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// --- Default home route (fix) ---
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

// --- Load routes ---
require('./routes')(app);

module.exports = app;
