import { GoogleGenAI, Type } from '@google/genai';
import { Request, Response } from 'express';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const parseEvent = async (req: Request, res: Response) => {
	const { text } = req.body;

	const now = new Date().toISOString();

	const prompt = `
		You are a smart calendar assistant.

		Give a user input in natural language, extract and return a structured JSON object with the following keys:
		- title: short title for the event
		- description: description for the event
		- startTime: ISO 8601 format (ensure timezone is +08:00)
		- endTime: ISO 8601 format (estimate duration if not specified) (ensure timezone is +08:00)

		Respond only with valid JSON.

		Example Input:
		"Meet Alex tomorrow at 2pm for coffee at Starbucks"

		Example Output:
		{
  		"title": "Meeting with Alex",
			"description": "A meeting with Alex"
  		"start": "2025-06-25T14:00:00+08:00",
  		"end": "2025-06-25T15:00:00+08:00"
		}

		Current time now is: ${now}
		Now parse this input:
		"${text}"
	`;

	const response = await ai.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: prompt,
		config: {
			responseMimeType: 'application/json',
			responseSchema: {
				type: Type.OBJECT,
				properties: {
					title: { type: Type.STRING },
					description: { type: Type.STRING },
					start: { type: Type.STRING },
					end: { type: Type.STRING },
				},
				propertyOrdering: ['title', 'description', 'start', 'end'],
			},
		},
	});

	const candidate = response.candidates?.[0];
	const part = candidate?.content?.parts?.[0];
	const responseText = part?.text;

	if (responseText) {
		const event = JSON.parse(responseText);
		res.json(event);
	} else {
		console.error('LLM response is missing content text.');
	}
};

export const resolveConflict = async (req: Request, res: Response) => {
	const { newEvent, existingEvents } = req.body;

	const prompt = `
		You are a smart calendar assistant.

		The user is trying to schedule a new event, but it may overlap with existing events in their calendar.
		Your task is to analyze the new event and the existing events, detect any conflicts, and suggest a new non-conflicting time for the new event.

		
	`;

	const response = await ai.models.generateContent({
		model: 'gemini-2.0-flash-lite',
		contents: prompt,
		config: {
			responseMimeType: 'application/json',
			responseSchema: {
				type: Type.OBJECT,
				properties: {
					title: { type: Type.STRING },
					startTime: { type: Type.STRING },
					endTime: { type: Type.STRING },
				},
				propertyOrdering: ['title', 'startTime', 'endTime'],
			},
		},
	});

	const candidate = response.candidates?.[0];
	const part = candidate?.content?.parts?.[0];
	const responseText = part?.text;

	if (responseText) {
		const event = JSON.parse(responseText);
		res.json(event);
	} else {
		console.error('LLM response is missing content text.');
	}
};
