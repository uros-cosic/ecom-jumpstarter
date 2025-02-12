"use client"

import { checkoutDeliveryFormSchema, checkoutDeliveryFormSchemaValues } from "@/lib/forms/checkout-delivery"
import { CHECKOUT_STEP, IRegion, IShippingMethod } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { formatCurrency } from "@/lib/utils"
import { Button } from "../ui/button"
import { updateCart } from "@/lib/data/cart"
import { toast } from "sonner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type Props = {
    shippingMethod: IShippingMethod | null
    shippingMethods: IShippingMethod[]
    locale: string
    region: IRegion
    submitLabel: string
}

const CheckoutDeliveryForm = ({ submitLabel, shippingMethod, shippingMethods, region, locale }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<checkoutDeliveryFormSchemaValues>({
        resolver: zodResolver(checkoutDeliveryFormSchema),
        defaultValues: {
            shippingMethod: shippingMethod?._id ?? ''
        }
    })

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const onSubmit = async (values: checkoutDeliveryFormSchemaValues) => {
        setLoading(true)

        const [, err] = await updateCart({ shippingMethod: values.shippingMethod })

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        const params = new URLSearchParams(searchParams)
        params.set("step", CHECKOUT_STEP.PAYMENT)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })

        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
                <FormField
                    name="shippingMethod"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup {...field} onValueChange={(val) => form.setValue("shippingMethod", val)}>
                                    {shippingMethods.map(method => (
                                        <div key={method._id} className="rounded-md border bg-white p-5 w-full flex items-center justify-between">
                                            <div className="flex items-center space-x-5">
                                                <RadioGroupItem value={method._id} id={method._id} />
                                                <Label
                                                    htmlFor={method._id}
                                                    className="w-full hover:underline cursor-pointer"
                                                >
                                                    {method.name}
                                                </Label>
                                            </div>
                                            <span className="text-sm text-foreground/80">
                                                {formatCurrency(locale, region.currency, method.cost)}
                                            </span>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading} aria-disabled={loading} className="w-fit">{submitLabel}</Button>
            </form>
        </Form>
    )
}

export default CheckoutDeliveryForm
