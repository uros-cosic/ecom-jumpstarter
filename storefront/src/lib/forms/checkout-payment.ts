'use client'

import { z } from 'zod'

export const checkoutPaymentFormSchema = z.object({
    paymentMethod: z.string(),
})

export type checkoutPaymentFormSchemaValues = z.infer<
    typeof checkoutPaymentFormSchema
>
