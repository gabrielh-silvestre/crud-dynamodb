import { z } from 'zod';

export const ZProduct = z.object({
  id: z.string().ulid(),

  name: z.string(),
  description: z.string(),
  image: z.string().optional().nullable(),
  price: z.number().positive(),
  availableQuantity: z.number().positive(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type IProduct = z.infer<typeof ZProduct>;

export const ZProductCreateDto = ZProduct.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).required();

export type ProductCreateDto = z.infer<typeof ZProductCreateDto>;
