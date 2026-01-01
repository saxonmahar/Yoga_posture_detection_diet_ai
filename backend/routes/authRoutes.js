const express = require('express');
const authRouter = express.Router();

const registerValidation = require('../middleware/registerMiddleware')
const registerController = require('../controllers/registerController')

const loginValidation = require('../middleware/loginMiddleware')
const loginController = require('../controllers/loginController')

const { getMeController, logoutController } = require('../controllers/authController')
const { verifyToken } = require('../middleware/authMiddleware')

authRouter.post('/register', registerValidation, registerController)
authRouter.post('/login', loginValidation, loginController)
authRouter.get('/me', verifyToken, getMeController)
authRouter.post('/logout', logoutController)

module.exports = authRouter