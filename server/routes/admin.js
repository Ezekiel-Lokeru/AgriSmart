const { getUsers, deactivateUser, changeUserRole, getAnalytics } = require('../controllers/admin');
const { verifyAdmin } = require('../middlewares');

module.exports = (app, url) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Get all users
  app.get(`${url}/users`, verifyAdmin, getUsers);

  // Deactivate user
  app.patch(`${url}/users/:id/deactivate`, verifyAdmin, deactivateUser);

  // Change user role
  app.patch(`${url}/users/:id/role`, verifyAdmin, changeUserRole);

  // Get analytics
  app.get(`${url}/analytics`, verifyAdmin, getAnalytics);
};
