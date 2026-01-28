//External module
import express from 'express';

//Local module
import protectedRoute from '../middleware/auth.middleware.js';
import{ changeEmail,  changeGender,  changeUsername,  searchUser,  validateUsername } from '../controllers/userController.js';

const router = express.Router();

router.patch('/profile/usernameValidate',  validateUsername); //get or post
router.patch('/profile/changeUsername/:id', protectedRoute, changeUsername);
router.patch('/profile/changeEmail/:id', protectedRoute, changeEmail);


router.patch('/profile/changeGender/:id', protectedRoute, changeGender);

router.post('search', protectedRoute , searchUser);

export default router;