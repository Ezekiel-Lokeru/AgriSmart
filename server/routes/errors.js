const { errors } = require('../controllers');

// Export the routes
module.exports =  (app) => {
  app.use(errors.notFound);
  app.use(errors.errorHandler);
  app.use(errors.badGateway);
};