"use client"

import { createAddressFormSchema, createAddressFormSchemaValues } from '@/lib/forms/address'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { createAddress } from '@/lib/data/addresses'
import { toast } from 'sonner'
import { IUser } from '@/lib/types'

type Props = {
    firstNameLabel: string
    lastNameLabel: string
    companyLabel: string
    addressLabel: string
    postalCodeLabel: string
    cityLabel: string
    provinceLabel: string
    phoneLabel: string
    submitLabel: string
    successMessage: string
    countryLabel: string
    setOpen: (b: boolean) => void
    user: IUser
}

const NewAddressForm = ({ user, countryLabel, submitLabel, cityLabel, phoneLabel, addressLabel, companyLabel, lastNameLabel, provinceLabel, postalCodeLabel, firstNameLabel, successMessage, setOpen }: Props) => {
    const form = useForm<createAddressFormSchemaValues>({
        resolver: zodResolver(createAddressFormSchema),
        defaultValues: {
            user: user._id
        }
    })

    const onSubmit = async (values: createAddressFormSchemaValues) => {
        const [, err] = await createAddress(values)

        if (err) {
            toast.error(err)
            return
        }
        toast.success(successMessage)
        setOpen(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-1 gap-3'>
                <FormField
                    name='firstName'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='given-name'
                                    required={true}
                                    placeholder={firstNameLabel}
                                    aria-label={firstNameLabel}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='lastName'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='family-name'
                                    required={true}
                                    placeholder={lastNameLabel}
                                    aria-label={lastNameLabel}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='company'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='organization'
                                    placeholder={companyLabel}
                                    aria-label={companyLabel}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='country'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='country-name'
                                    placeholder={countryLabel}
                                    aria-label={countryLabel}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='address'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='address-line1'
                                    required={true}
                                    placeholder={addressLabel}
                                    aria-label={addressLabel}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='postalCode'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='postal-code'
                                    required={true}
                                    placeholder={postalCodeLabel}
                                    aria-label={postalCodeLabel}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='city'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='home city'
                                    required={true}
                                    placeholder={cityLabel}
                                    aria-label={cityLabel}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='province'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='address-level1'
                                    placeholder={provinceLabel}
                                    aria-label={provinceLabel}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='phone'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='mobile tel'
                                    required={true}
                                    placeholder={phoneLabel}
                                    aria-label={phoneLabel}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">{submitLabel}</Button>
            </form>
        </Form>
    )
}

export default NewAddressForm
