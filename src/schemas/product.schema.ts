import {z} from 'zod';

export const productSchema = z.object({
	name: z
		.string('Product English name is required')
		.min(2, 'Product English name is required')
		.max(200, 'Product English name must be under 200 characters'),
	original_price: z.string().min(1, 'Price is required'),
	material: z.string('Material is required').optional(),
	fit: z.string('Fit is required').optional(),
	stock_S: z.any().optional(),
	stock_M: z.any().optional(),
	stock_L: z.any().optional(),
	stock_XL: z.any().optional(),
	stock_XXL: z.any().optional(),
	categories: z
		.object({
			label: z.string().min(1, 'Label is required'),
			value: z.string().min(1, 'Value is required'),
		})
		.nullable()
		.optional(),
	isPublish: z
		.object({
			label: z.string().min(1, 'Label is required'),
			value: z.boolean().optional(),
		})
		.nullable()
		.optional(),
	isSizeable: z
		.object({
			label: z.string().min(1, 'Label is required'),
			value: z.boolean().optional(),
		})
		.nullable()
		.refine((val) => val !== null && val !== undefined, {
			message: 'Sizeable selection is required',
		}),

	size: z
		.array(
			z.object({
				label: z.string().min(1, 'Label is required'),
				value: z.string().min(1, 'Size is required'),
			}),
		)
		.optional(),
	stocks: z.any().optional(),

	color: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			}),
		)
		.optional(),
	description: z.string().optional(),

	meta_description: z.string('Product Meta Description Is required').optional(),
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
