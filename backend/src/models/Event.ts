import { Schema, model, Types } from 'mongoose';

const eventSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: true },
	priority: Number,

	userId: { type: Types.ObjectId, ref: 'User', required: true },
});

export const Event = model('Event', eventSchema);
