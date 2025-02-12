'use client'

import { z } from 'zod'

export const checkoutReviewFormSchema = z.object({
    customer: z.string().optional(),
    cart: z.string(),
    region: z.string(),
})

export type checkoutReviewFormSchemaValues = z.infer<
    typeof checkoutReviewFormSchema
>
