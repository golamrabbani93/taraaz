import {z} from 'zod';

export const productSchema = z.object({
	name: z
		.string('Product English name is required')
		.min(2, 'Product English name must be at least 2 characters')
		.max(100, 'Product English name must be under 100 characters'),
	original_price: z.string().min(1, 'Price is required'),
	material: z.string('Material is required').optional(),
	fit: z.string('Fit is required').optional(),

	categories: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	size: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	color: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	description: z.string().optional(),
	b_name: z
		.string('Product Bangla name is required')
		.min(2, 'Product Bangla name must be at least 2 characters')
		.max(100, 'Product Bangla name must be under 100 characters'),
	b_description: z.string().optional(),
	meta_description: z.string('Product Meta Description Is required').optional(),
	b_meta_description: z.string('Product Bangla Meta Description Is required').optional(),
	tags: z.string('Product tags are required').optional(),
});

export const categorySchema = z.object({
	name: z
		.string('Category name is required')
		.min(2, 'Category name is required')
		.max(100, 'Category name must be under 100 characters'),
	value: z

		.string('Category value is required')
		.min(2, 'Category value is required')
		.max(100, 'Category value must be under 100 characters'),
});
