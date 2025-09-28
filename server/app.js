const express = require("express");
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const cors = require("cors");

const app = express();

let corsOptions = {
	origin: [
		`http://localhost:${process.env['PORT']}`,
		"https://192.168.68.21:${process.env['PORT']}",
		"http://localhost:5173"
	],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(cookieParser())

// health check endpoint
app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

// adjust the limit to the size of the file you want to upload
app.use(bodyParser.json({ limit: '50mb' })); // Increase the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// serve service worker from the root
app.get('/service-worker.js', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'js', 'service-worker.js'));
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Require and start all routes
require('./routes')(app);


module.exports = app;