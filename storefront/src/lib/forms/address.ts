'use client'

import { z } from 'zod'

// TODO: Localize error messages => use server func >:DDD

export const createAddressFormSchema = z.object({
    company: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    province: z.string().optional(),
    postalCode: z.string(),
    phone: z.string(),
    country: z.string(),
    user: z.string(),
})

export type createAddressFormSchemaValues = z.infer<
    typeof createAddressFormSchema
>
