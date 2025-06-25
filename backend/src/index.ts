import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { initializeDatabase } from './utils/database';
import eventRoutes from './routes/eventRoute';
import authRoutes from './routes/authRoute';
import aiRoutes from './routes/aiRoute';
import MongoStore from 'connect-mongo';

dotenv.config();

const app = express();

app.use(
	cors({
		origin: ['http://localhost:3000', 'http://nextime.notsalt.com', 'https://nextime.notsalt.com'],
		credentials: true,
	})
);
app.use(express.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET || 'pizza',
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
		cookie: {
			secure: false,
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 1000 * 60 * 60 * 24 * 7,
		}, // 7 days
	})
);

initializeDatabase();

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`NexTime API is running on port ${port}`);
});
