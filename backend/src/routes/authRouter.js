//External Module
import express from 'express';

//Local Module
import { postLogin, postRegister, postRequestOtp, postRequestResendOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', postRegister);
router.post('/login', postLogin);
router.post('/request-otp', postRequestOtp);
router.post('/request-resend-otp', postRequestResendOtp);

export default router;
