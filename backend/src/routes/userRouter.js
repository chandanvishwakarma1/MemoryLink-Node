//External module
import express from 'express';

//Local module
import protectedRoute from '../middleware/auth.middleware.js';
import{ validateUsername } from '../controllers/userController.js';

const router = express.Router();

router.patch('/profile/:id', protectedRoute, validateUsername);

export default router;