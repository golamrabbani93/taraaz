import {z} from 'zod';

export const registerSchema = z.object({
	name: z
		.string('Name is required')
		.min(2, 'Name is required')
		.max(100, 'Name must be under 100 characters'),
	email: z.string().email('Invalid email address'),
	phone: z.string().min(10, 'Phone number too short').max(15, 'Phone number too long'),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(100, 'Password too long'),
});

export const registerBanglaSchema = z.object({
	name: z.string('নাম আবশ্যক').min(2, 'নাম আবশ্যক').max(100, 'নাম ১০০ অক্ষরের মধ্যে হতে হবে'),
	email: z.string().email('অবৈধ ইমেইল ঠিকানা'),
	phone: z.string().min(10, 'ফোন নম্বর খুব ছোট').max(15, 'ফোন নম্বর খুব বড়'),
	password: z

		.string()
		.min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে')
		.max(100, 'পাসওয়ার্ড খুব বড়'),
});
