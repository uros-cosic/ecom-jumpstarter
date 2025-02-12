"use client"

import { useForm } from 'react-hook-form'
import { ClassNameValue } from 'tailwind-merge'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import discountCodeFormSchema, { discountCodeFormSchemaValues } from '@/lib/forms/discount-code'
import { getDiscountCodeByCode } from '@/lib/data/discount-codes'
import { updateCart } from '@/lib/data/cart'

type Props = {
    successMessage: string
    ctaLabel: string
    className?: ClassNameValue
}

const DiscountCodeForm = ({ successMessage, ctaLabel, className }: Props) => {
    const form = useForm<discountCodeFormSchemaValues>({
        resolver: zodResolver(discountCodeFormSchema),
        defaultValues: {
            code: ''
        }
    })


    const onSubmit = async (values: discountCodeFormSchemaValues) => {
        const [data, error] = await getDiscountCodeByCode(values.code)

        if (error) {
            toast.error(error)
            return
        }

        const [, cartErr] = await updateCart({ discountCode: data!._id })

        if (cartErr) {
            toast.error(cartErr)
            return
        }

        toast.success(successMessage)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex items-center", className)}
            >
                <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    aria-label="Code"
                                    name="code"
                                    className='rounded-none bg-secondary text-secondary-foreground'
                                    placeholder='Code'
                                    required
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="rounded-none border border-l-0">{ctaLabel}</Button>
            </form>
        </Form>
    )
}

export default DiscountCodeForm
