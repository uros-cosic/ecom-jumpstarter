'use client'

import { z } from 'zod'

export const shippingMethodSchema = z.object({
    name: z.string(),
    cost: z.number(),
    region: z.string(),
})

export type shippingMethodSchemaValues = z.infer<typeof shippingMethodSchema>
