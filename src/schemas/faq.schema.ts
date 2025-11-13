import z from 'zod';

export const faqSchema = z.object({
	title: z
		.string()
		.min(2, 'English Title is required')
		.max(200, 'Title must be under 200 characters'),
	b_title: z
		.string()
		.min(2, 'Bangla Title is required')
		.max(200, 'Title must be under 200 characters'),
});
