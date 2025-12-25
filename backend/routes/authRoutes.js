const express = require('express');
const authRouter = express.Router();

const registerValidation = require('../middleware/registerMiddleware')
const registerController = require('../controllers/registerController')


const loginValidation = require('../middleware/loginMiddleware')
const loginController = require('../controllers/loginController')

authRouter.post('/register', registerValidation ,registerController )
authRouter.post('/login',loginValidation,loginController)


module.exports = authRouter