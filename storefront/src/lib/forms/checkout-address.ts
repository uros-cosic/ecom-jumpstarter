'use client'

import { z } from 'zod'

export const checkoutAddressFormSchema = z.object({
    company: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    province: z.string().optional(),
    postalCode: z.string(),
    phone: z.string(),
    country: z.string(),
    user: z.string().optional(),
    email: z.string().email(),
})

export type checkoutAddressFormSchemaValues = z.infer<
    typeof checkoutAddressFormSchema
>
