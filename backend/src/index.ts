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
		origin: process.env.ORIGIN_URL || 'http://localhost:3000',
		credentials: true,
	})
);
console.log(`${process.env.ORIGIN_URL}`);
app.use(express.json());

app.set("trust proxy", true);
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'pizza',
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, autoRemove: 'native' }),
		cookie: {
			secure: true,
			httpOnly: false,
			sameSite: 'none',
			maxAge: 1000 * 60 * 60 * 24 * 7,
			domain: '.notsalt.com'
		}, // 7 days
	})
);

initializeDatabase();

// debugging cors middleware
app.use((req, res, next) => {
  console.log('--- Incoming Request ---');
  console.log('Time:', new Date().toISOString());
  console.log('Origin:', req.headers.origin);
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Headers:', req.headers);
  console.log('Cookies:', req.headers.cookie || 'None');
  console.log('------------------------');
  next();
});

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`NexTime API is running on port ${port}`);
});
