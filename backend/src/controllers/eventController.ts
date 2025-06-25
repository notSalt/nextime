import { Request, Response, NextFunction } from 'express';
import { Event } from '../models/Event';

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, description, startTime, endTime } = req.body;
		console.log(req.body);
		const event = await Event.create({
			title,
			description,
			startTime,
			endTime,
			userId: req.session.userId,
		});
		res.json({
			id: event._id.toString(),
			title: event.title,
			description: event.description,
			start: event.startTime,
			end: event.endTime,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.body;

	try {
		await Event.findOneAndDelete({ _id: id });

		res.json({ status: 'Event deleted', id });
	} catch (err) {
		console.error('Error deleting event:', err);
		res.status(500).json({ error: 'Failed to delete event' });
	}
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
	const { id, title, description, startTime, endTime } = req.body;
	console.log(req.body);

	try {
		await Event.findOneAndUpdate(
			{ _id: id },
			{
				title: title,
				description: description,
				startTime: startTime,
				endTime: endTime,
			}
		);

		res.json({ status: 'updated', id });
	} catch (err) {
		next(err);
	}
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
	const events = await Event.find({ userId: req.session.userId });
	const formattedEvents = events.map(e => {
		return {
			id: e._id,
			title: e.title,
			description: e.description,
			start: e.startTime,
			end: e.endTime,
		};
	});
	res.json(formattedEvents);
};
