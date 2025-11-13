import {z} from 'zod';

export const messageSchema = z.object({
	name: z
		.string('Name is required')
		.min(2, 'Name is required')
		.max(100, 'Name must be under 100 characters'),
	email: z.string().email('Invalid email address'),
	subject: z
		.string()
		.min(2, 'Subject is required')
		.max(100, 'Subject must be under 100 characters'),
	message: z
		.string('message is required')
		.min(2, 'message is required')
		.max(1000, 'Message is too long'),
});

export const messageSchemaBangla = z.object({
	name: z
		.string('নাম আবশ্যক')
		.min(2, 'নাম আবশ্যক')
		.max(100, 'নাম ১০০ অক্ষরের চেয়ে বেশি হতে পারবে না'),
	email: z.string().email('সঠিক ইমেইল ঠিকানা দিন'),
	subject: z.string().min(2, 'বিষয় আবশ্যক').max(100, 'বিষয় ১০০ অক্ষরের চেয়ে বেশি হতে পারবে না'),
	message: z.string('বার্তা আবশ্যক').min(2, 'বার্তা আবশ্যক').max(1000, 'বার্তা অনেক বড়'),
});
