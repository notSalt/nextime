import express from 'express';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../controllers/eventController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();

router.use(isAuthenticated);

router.post('/create', createEvent);
router.post('/delete', deleteEvent);
router.post('/update', updateEvent);
router.get('/fetch', getEvents);

export default router;
