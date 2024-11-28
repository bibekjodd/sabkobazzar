import z from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(4, 'Too short name').max(30, 'Too long name'),
  phone: z
    .preprocess((val) => Number(val) || undefined, z.number().optional())
    .refine((phone) => {
      if (!phone) return true;
      return String(phone).length === 10;
    }, 'Invalid phone number')
});
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

const categorySchema = z.enum(['electronics', 'realestate', 'arts', 'others']);
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

export const registerAuctionSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(10, 'Too short title')
    .max(200, 'Too long title'),
  description: z
    .string({ required_error: 'Description is required' })
    .max(500, 'Too long description'),
  lot: z.preprocess(
    (val) => Number(val) || undefined,
    z
      .number({ required_error: 'Lot number is required' })
      .min(1, 'Lot number must be positive and should not exceed 10')
      .max(10, 'Lot number must be positive and should not exceed 10')
  ),
  condition: z.enum(['new', 'first-class', 'repairable']),
  startsAt: z
    .string({ required_error: 'Please select auction date' })
    .datetime({ message: 'Invalid date' }),
  minBid: z.preprocess(
    (val) => Number(val) || undefined,
    z
      .number({
        invalid_type_error: '',
        required_error: 'Minimum Bid value must be at least 10,000'
      })
      .min(10000, 'Minimum Bid value must be at least 10,000')
  ),
  minBidders: z.preprocess(
    (val) => Number(val) || undefined,
    z
      .number({
        invalid_type_error: 'Must be at least 2 bidders',
        required_error: 'Must be at least 2 bidders'
      })
      .min(2, 'Must be at least 2 bidders')
      .max(10, "Bidders can't exceed 10 people")
  ),
  maxBidders: z.preprocess(
    (val) => Number(val) || undefined,
    z
      .number({
        invalid_type_error: "Max bidders can't exceed 10 people",
        required_error: "Max bidders can't exceed 10 people"
      })
      .min(2, 'Must be at least 2 bidders')
      .max(10, "Max bidders can't exceed 10 people")
  ),
  isInviteOnly: z.boolean().default(false)
});
export type RegisterAuctionSchema = z.infer<typeof registerAuctionSchema>;
