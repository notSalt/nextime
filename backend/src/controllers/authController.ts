import { User } from '../models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const hashed = await bcrypt.hash(password, 10);
	const user = await User.create({ email, password: hashed });
	req.session.userId = user._id.toString();
	res.json({ message: 'Registered', user });
};

export const login = async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user || !(await bcrypt.compare(password, user.password))) {
		res.status(401).json({ message: 'Invalid credentials' });
	} else {
		req.session.userId = user._id.toString();
		res.json({ message: 'Logged in', user });
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

		res.status(200).json({ message: 'Logged out successfully' });
	});
};
