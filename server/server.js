const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    let url = HOST === '0.0.0.0' || HOST === '127.0.0.1' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Server is running at ${url}`);
});