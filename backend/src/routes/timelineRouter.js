//External modules
import express from 'express'

//local module
import protectedRoute from '../middleware/auth.middleware.js'
import { createTimeline } from '../controllers/timelineController.js';

const router = express.Router();

router.post('/', protectedRoute, createTimeline)

// // Timeline CRUD operations
// router.get('/', authenticate, getTimelines);
// router.get('/:id', authenticate, getTimelineById);
// router.put('/:id', authenticate, updateTimeline);
// router.delete('/:id', authenticate, deleteTimeline);

// // Member management
// router.post('/:id/members', authenticate, addMember);
// router.delete('/:id/members/:userId', authenticate, removeMember)

export default router;