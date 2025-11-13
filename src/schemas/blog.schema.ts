import {z} from 'zod';
export const blogSchema = z.object({
	title: z.string('Title is required').min(1, 'Title is required'),
	author_name: z.string('Author name is required').min(1, 'Author name is required'),
	content: z.string('Content is required').min(1, 'Content is required'),
	b_title: z.string('Bangla Title is required').min(1, 'Bangla Title is required'),
	b_content: z.string('Bangla Content is required').min(1, 'Bangla Content is required'),
});
