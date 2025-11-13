import {z} from 'zod';

export const checkoutSchema = z.object({
	name: z
		.string('Name is required')
		.min(2, 'Name is required')
		.max(100, 'Name must be under 100 characters'),
	email: z.string('email is required').email('Invalid email address'),
	phone: z
		.string('phone is required')
		.min(10, 'Phone number too short')
		.max(15, 'Phone number too long'),
	address: z
		.string('address is required')
		.min(5, 'Address is required')
		.max(200, 'Address must be under 200 characters'),
});

export const checkoutSchemaBangla = z.object({
	name: z
		.string('নাম আবশ্যক')
		.min(2, 'নাম আবশ্যক')
		.max(100, 'নাম ১০০ অক্ষরের চেয়ে বেশি হতে পারবে না'),
	email: z.string('ইমেইল আবশ্যক').email('সঠিক ইমেইল ঠিকানা দিন'),
	phone: z.string('ফোন নম্বর আবশ্যক').min(10, 'ফোন নম্বর খুব ছোট').max(15, 'ফোন নম্বর খুব বড়'),
	address: z
		.string('ঠিকানা আবশ্যক')
		.min(5, 'ঠিকানা খুব ছোট')
		.max(200, 'ঠিকানা ২০০ অক্ষরের চেয়ে বেশি হতে পারবে না'),
});
