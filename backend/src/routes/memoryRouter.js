//External module
import express from 'express'
import protectedRoute from '../middleware/auth.middleware';
import { createMemory } from '../controllers/memoryController';

//local module

const router = express.Router();

router.post('/:id/memories', protectedRoute, createMemory)
router.get('/:id/memories', protectedRoute, createMemory)