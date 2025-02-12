"use client"

import { checkoutAddressFormSchema, checkoutAddressFormSchemaValues } from "@/lib/forms/checkout-address"
import { CHECKOUT_STEP, IAddress, IUser } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { createAddress } from "@/lib/data/addresses"
import { toast } from "sonner"
import { updateCart } from "@/lib/data/cart"

type Props = {
    address: IAddress | null
    addresses: IAddress[] | null
    email?: string | null
    customer: IUser | null
    firstNameLabel: string
    lastNameLabel: string
    companyLabel: string
    addressLabel: string
    postalCodeLabel: string
    cityLabel: string
    provinceLabel: string
    phoneLabel: string
    submitLabel: string
    countryLabel: string
    chooseAddressLabel: string
    helloMessage: string
}

const CheckoutAddressForm = ({ customer, address, addresses, email, addressLabel, countryLabel, postalCodeLabel, helloMessage, chooseAddressLabel, cityLabel, submitLabel, phoneLabel, provinceLabel, companyLabel, lastNameLabel, firstNameLabel }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<checkoutAddressFormSchemaValues>({
        resolver: zodResolver(checkoutAddressFormSchema),
        defaultValues: {
            email: email ?? '',
            address: address?.address ?? '',
            city: address?.city ?? '',
            company: address?.company ?? undefined,
            country: address?.country ?? '',
            firstName: address?.firstName ?? customer?.name.split(' ')[0] ?? '',
            lastName: address?.lastName ?? customer?.name.split(' ')[1] ?? '',
            phone: address?.phone ?? '',
            postalCode: address?.postalCode ?? '',
            province: address?.province ?? undefined,
            user: customer?._id
        }
    })

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const onSubmit = async (values: checkoutAddressFormSchemaValues) => {
        setLoading(true)

        const [addressData, addressErr] = await createAddress(values)

        if (addressErr) {
            toast.error(addressErr)
            setLoading(false)
            return
        }

        const [, cartErr] = await updateCart({ address: addressData!._id, email: values.email })

        if (cartErr) {
            toast.error(cartErr)
            setLoading(false)
            return
        }

        const params = new URLSearchParams(searchParams)
        params.set("step", CHECKOUT_STEP.DELIVERY)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })

        setLoading(false)
    }

    const handleAddressChange = (value: string) => {
        const address = addresses!.find(a => a._id === value)!

        Object.keys(address).forEach(key => {
            form.setValue(key as keyof checkoutAddressFormSchemaValues, address[key as keyof typeof checkoutAddressFormSchema.keyof])
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {!!addresses?.length &&
                    <div className="lg:col-span-2 flex flex-col gap-1">
                        <p className="text-foreground/80 text-sm">
                            {helloMessage}
                        </p>
                        <Select onValueChange={handleAddressChange}>
                            <SelectTrigger className="bg-white h-11">
                                {chooseAddressLabel}
                            </SelectTrigger>
                            <SelectContent>
                                {addresses.map((addy) => (
                                    <SelectItem key={addy._id} value={addy._id}>
                                        <>
                                            <div className="flex flex-col text-sm text-foreground/80">
                                                <p className="text-foreground font-medium">Adresa</p>
                                                <span>{`${addy.firstName} ${addy.lastName}`}</span>
                                                {!!addy.company && <span>{addy.company}</span>}
                                                <span>{addy.address}</span>
                                                <span>{`${addy.postalCode}, ${addy.city}`}</span>
                                            </div>
                                        </>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                }
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
                <FormField
                    name='email'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoComplete='email'
                                    required={true}
                                    placeholder="Email"
                                    aria-label="Email"
                                    type="email"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading} aria-disabled={loading}>{submitLabel}</Button>
            </form>
        </Form>
    )
}

export default CheckoutAddressForm
