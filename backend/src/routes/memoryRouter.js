//External module
import express from 'express'
import protectedRoute from '../middleware/auth.middleware.js';
import { createMemory } from '../controllers/memoryController.js';

//local module

const router = express.Router();

router.post('/memories', protectedRoute, createMemory)

export default router
// router.get('/memories', protectedRoute, createMemory)