import {z} from 'zod';
export const videoSchema = z.object({
	title: z.string('title is required').min(1, 'title is required'),
	url: z.string('video url is required').min(1, 'video url is required').url('Invalid URL'),
});
