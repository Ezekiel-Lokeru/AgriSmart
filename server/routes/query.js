const { queries: { query } } = require('../controllers');

// @description registers all public query routes
module.exports = (app, url) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // Public AI query assistant (no auth)
  app.post(`${url}/ask`, query);
};
