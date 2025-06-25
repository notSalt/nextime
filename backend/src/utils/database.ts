import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initializeDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI as string);
		console.log('Database successfully initialized.');
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
