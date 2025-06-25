import { Router, Request, Response, NextFunction } from 'express';
import { login, register, logout } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', (req: Request, res: Response) => {
	if (req.session.userId) {
		res.json({ userId: req.session.userId });
	} else {
		res.status(401).json({ message: 'Not authenticated' });
	}
});

export default router;
