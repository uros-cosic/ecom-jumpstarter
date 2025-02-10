'use client'

import { z } from 'zod'

// TODO: Localize error messages => use server func >:DDD

const registerFormSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
    region: z.string(),
})

export type registerFormSchemaValues = z.infer<typeof registerFormSchema>

export default registerFormSchema
