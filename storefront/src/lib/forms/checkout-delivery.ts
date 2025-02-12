'use client'

import { z } from 'zod'

export const checkoutDeliveryFormSchema = z.object({
    shippingMethod: z.string(),
})

export type checkoutDeliveryFormSchemaValues = z.infer<
    typeof checkoutDeliveryFormSchema
>
