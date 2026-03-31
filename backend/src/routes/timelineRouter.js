//External modules
import express from 'express'

//local module
import protectedRoute from '../middleware/auth.middleware.js'
import { createTimeline, getTimelineById, getTimelines } from '../controllers/timelineController.js';

const router = express.Router();

router.post('/', protectedRoute, createTimeline)
router.get('/', protectedRoute, getTimelines);
router.get('/:id', protectedRoute, getTimelineById);

// // Timeline CRUD operations
// router.put('/:id', authenticate, updateTimeline);
// router.delete('/:id', authenticate, deleteTimeline);

// // Member management
// router.post('/:id/members', authenticate, addMember);
// router.delete('/:id/members/:userId', authenticate, removeMember)

export default router;