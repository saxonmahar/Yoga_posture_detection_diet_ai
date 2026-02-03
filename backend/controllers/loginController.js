// controllers/authController.js
const secureLoginController = require('./secureLoginController');

// POST /api/auth/login - Use secure login controller
const loginController = secureLoginController;

module.exports = loginController;
