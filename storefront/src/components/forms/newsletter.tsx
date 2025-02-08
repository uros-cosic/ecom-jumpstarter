"use client"

import { useForm } from 'react-hook-form'
import { ClassNameValue } from 'tailwind-merge'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import newsletterFormSchema, { newsletterFormSchemaValues } from '@/lib/forms/newsletter'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { subscribeToNewsletter } from '@/lib/data/newsletter'
import { useEffect, useState } from 'react'
import { IRegion } from '@/lib/types'
import { useParams } from 'next/navigation'
import { getRegionByCountryCode } from '@/lib/data/regions'
import { toast } from 'sonner'

type Props = {
    successMessage: string
    ctaLabel: string
    className?: ClassNameValue
}

const NewsletterForm = ({ successMessage, ctaLabel, className }: Props) => {
    const [region, setRegion] = useState<IRegion | null>(null)

    const form = useForm<newsletterFormSchemaValues>({
        resolver: zodResolver(newsletterFormSchema),
        defaultValues: {
            email: ''
        }
    })

    const { countryCode } = useParams()

    const fetchRegion = async () => {
        const region = await getRegionByCountryCode(countryCode as string)

        if (region) setRegion(region)
    }

    useEffect(() => {
        fetchRegion()
    }, [])

    const onSubmit = async (values: newsletterFormSchemaValues) => {
        const [, error] = await subscribeToNewsletter(values.email, region!._id)

        if (error) {
            toast.error(error)
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
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    aria-label="Email"
                                    name="email"
                                    type="email"
                                    className='rounded-none bg-secondary text-secondary-foreground'
                                    placeholder='Email'
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

export default NewsletterForm
