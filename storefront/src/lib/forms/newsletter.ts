'use client'

import { z } from 'zod'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (issue.code === z.ZodIssueCode.invalid_type) {
        return { message: 'Popunite polje' }
    }

    return { message: ctx.defaultError }
}

z.setErrorMap(customErrorMap)

const newsletterFormSchema = z.object({ email: z.string().email() })

export type newsletterFormSchemaValues = z.infer<typeof newsletterFormSchema>

export default newsletterFormSchema
