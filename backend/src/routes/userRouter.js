//External module
import express from 'express';

//Local module
import protectedRoute from '../middleware/auth.middleware.js';
import{ changeEmail,  changeUsername,  validateUsername } from '../controllers/userController.js';

const router = express.Router();

router.patch('/profile/usernameValidate',  validateUsername);
router.patch('/profile/changeUsername/:id', protectedRoute, changeUsername);
router.patch('/profile/changeEmail/:id', protectedRoute, changeEmail)

export default router;