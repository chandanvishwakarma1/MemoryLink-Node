//External modules
import express from 'express'

//local module
import protectedRoute from '../middleware/auth.middleware.js'
import { createTimeline, deleteTimeline, getTimelineById, getTimelines } from '../controllers/timelineController.js';

const router = express.Router();

router.post('/', protectedRoute, createTimeline)
router.get('/', protectedRoute, getTimelines);
router.get('/:id', protectedRoute, getTimelineById);
router.delete('/:id', protectedRoute, deleteTimeline);

// // Timeline CRUD operations
// router.put('/:id', authenticate, updateTimeline);

// // Member management
// router.post('/:id/members', authenticate, addMember);
// router.delete('/:id/members/:userId', authenticate, removeMember)

export default router;