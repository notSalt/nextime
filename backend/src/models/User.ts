import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

export const User = model('User', userSchema);
