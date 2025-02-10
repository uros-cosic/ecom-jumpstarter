'use client'

import { z } from 'zod'

// TODO: Localize error messages => use server func >:DDD

export const nameChangeFormSchema = z.object({ name: z.string() })

export type nameChangeFormSchemaValues = z.infer<typeof nameChangeFormSchema>

export const emailChangeFormSchema = z.object({ email: z.string().email() })

export type emailChangeFormSchemaValues = z.infer<typeof emailChangeFormSchema>

export const passwordChangeFormSchema = z.object({
    passwordCurrent: z.string().min(8),
    password: z.string().min(8),
})

export type passwordChangeFormSchemaValues = z.infer<
    typeof passwordChangeFormSchema
>
