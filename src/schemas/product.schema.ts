import {z} from 'zod';

export const productSchema = z.object({
	name: z
		.string('Product English name is required')
		.min(2, 'Product English name must be at least 2 characters')
		.max(100, 'Product English name must be under 100 characters'),
	original_price: z.string().min(1, 'Original price is required'),
	type: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	weight: z.string().min(1, 'Product weight is required'),
	description: z
		.string()
		.min(10, 'Product description must be at least 10 characters')
		.max(1000, 'Product description must be under 1000 characters'),
	b_name: z
		.string('Product Bangla name is required')
		.min(2, 'Product Bangla name must be at least 2 characters')
		.max(100, 'Product Bangla name must be under 100 characters'),
	b_description: z
		.string()
		.min(10, 'Product Bangla description must be at least 10 characters')
		.max(1000, 'Product Bangla description must be under 1000 characters'),
	meta_description: z
		.string('Product Meta Description Is required')
		.min(10, 'Meta description must be at least 10 characters')
		.max(2000, 'Meta description must be under 2000 characters'),
	b_meta_description: z
		.string('Product Bangla Meta Description Is required')
		.min(10, 'Bangla Meta description must be at least 10 characters')
		.max(2000, 'Bangla Meta description must be under 2000 characters'),
	tags: z
		.string('Product tags are required')
		.min(2, 'Product tags must be at least 2 characters')
		.max(500, 'Product tags must be under 500 characters'),
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
