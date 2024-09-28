import z from 'zod';

const categorySchema = z.enum(['electronics', 'realestate', 'art', 'others']);
export const addProductSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(200, 'Too long title'),
  category: categorySchema,
  description: z.string().min(1, 'Description is required').max(500, 'Too long description'),
  price: z.preprocess(
    (val) => Number(val) || undefined,
    z
      .number({ required_error: 'Price is required', invalid_type_error: 'Price is required' })
      .min(10_000, 'Price must be at least 10,000')
      .transform((price) => Math.ceil(price))
  )
});
export type AddProductSchema = z.infer<typeof addProductSchema>;
