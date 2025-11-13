import {z} from 'zod';
export const mainBannerSchema = z.object({
	name: z.string().min(1, 'Banner name is required'),
});
