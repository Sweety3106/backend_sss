const express = require('express');
const router = express.Router();

const authController = require('./auth.controller'); 
const authMiddleware = require('../../middleware/auth');

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.get('/me', authMiddleware, authController.getMe);

router.post('/refresh', authController.refreshTokenController);

router.post('/logout', authController.logoutUser);

module.exports = router;