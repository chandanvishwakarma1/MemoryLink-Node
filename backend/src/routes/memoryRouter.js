//External module
import express from 'express'
import protectedRoute from '../middleware/auth.middleware.js';
import { createMemory, getMemories } from '../controllers/memoryController.js';

//local module

const router = express.Router({ mergeParams: true });

router.post('/memories', protectedRoute, createMemory)
router.get('/memories', protectedRoute, getMemories)

export default router
// router.get('/memories', protectedRoute, createMemory)