import { Router } from 'express';
import { parseEvent } from '../controllers/aiController';

const router = Router();

router.post('/parse-event', parseEvent);

export default router;
