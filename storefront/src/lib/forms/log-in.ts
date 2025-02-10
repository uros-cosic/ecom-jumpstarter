'use client'

import { z } from 'zod'

// TODO: Localize error messages => use server func >:DDD

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export type loginFormSchemaValues = z.infer<typeof loginFormSchema>

export default loginFormSchema
