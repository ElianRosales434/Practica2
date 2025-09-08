import express from 'express';
import loginController from './controllers/loginController.js';

const router = express.Router();

router.post('/register', loginController.register);
router.post('/login', loginController.login);
router.post('/forgot-password', loginController.forgotPassword);
router.post('/reset-password', loginController.resetPassword);

export default router;