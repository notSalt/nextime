import { User } from '../models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const hashed = await bcrypt.hash(password, 10);
	const user = await User.create({ username: "John", email, password: hashed });
	req.session.userId = user._id.toString();

	// Set non-HttpOnly cookie that middleware can read
	res.cookie('isLoggedIn', 'true', {
		httpOnly: false,
		secure: true,
		sameSite: 'none',
		domain: '.notsalt.com',
		maxAge: 1000 * 60 * 60 * 24,  // 1 day
	});

	res.json({ message: 'Registered', user });
};

export const login = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user || !(await bcrypt.compare(password, user.password))) {
		res.status(401).json({ message: 'Invalid credentials' });
	} else {
		req.session.userId = user._id.toString();

		// Set non-HttpOnly cookie that middleware can read
		res.cookie('isLoggedIn', 'true', {
			httpOnly: false,
			secure: true,
			sameSite: 'none',
			domain: '.notsalt.com',
			maxAge: 1000 * 60 * 60 * 24,  // 1 day
		});

		res.json({ message: 'Logged in' });
	}
};

export const logout = async (req: Request, res: Response) => {
	req.session.destroy(err => {
		if (err) {
			console.error('Logout error:', err);
			return res.status(500).json({ message: 'Logout failed' });
		}

		// Clear the session cookie
		res.clearCookie('connect.sid', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
		});

		res.clearCookie('isLoggedIn', {
			domain: '.notsalt.com',
			path: '/',
			secure: true,
			sameSite: 'none',
		});

		res.status(200).json({ message: 'Logged out successfully' });
	});
};
