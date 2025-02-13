"use client"

import { checkoutPaymentFormSchema, checkoutPaymentFormSchemaValues } from "@/lib/forms/checkout-payment"
import { AUTOMATED_PAYMENT_METHODS, CHECKOUT_STEP, IPaymentMethod } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Banknote, CreditCard, HandCoins } from "lucide-react"
import { Button } from "../ui/button"
import { updateCart } from "@/lib/data/cart"
import { toast } from "sonner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type Props = {
    paymentMethods: IPaymentMethod[]
    paymentMethod: IPaymentMethod | null
    submitLabel: string
    manualLabel: string
    cardLabel: string
}

const CheckoutPaymentForm = ({ manualLabel, submitLabel, cardLabel, paymentMethod, paymentMethods }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<checkoutPaymentFormSchemaValues>({
        resolver: zodResolver(checkoutPaymentFormSchema),
        defaultValues: {
            paymentMethod: paymentMethod?._id ?? ''
        }
    })

    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const onSubmit = async (values: checkoutPaymentFormSchemaValues) => {
        setLoading(true)

        const [, err] = await updateCart({ paymentMethod: values.paymentMethod })

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        const params = new URLSearchParams(searchParams)
        params.set("step", CHECKOUT_STEP.REVIEW)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })

        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
                <FormField
                    name="paymentMethod"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup {...field} onValueChange={val => form.setValue("paymentMethod", val)}>
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method._id}
                                            className="bg-white rounded-md border p-5 w-full flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-5">
                                                <RadioGroupItem value={method._id} id={method._id} />
                                                <Label
                                                    htmlFor={method._id}
                                                    className="w-full hover:underline cursor-pointer"
                                                >
                                                    {method.name === AUTOMATED_PAYMENT_METHODS.MANUAL ? manualLabel : method.name === AUTOMATED_PAYMENT_METHODS.STRIPE ? cardLabel : method.name}
                                                </Label>
                                            </div>
                                            <span className="text-sm text-foreground/80">
                                                {method.name.toLowerCase() === AUTOMATED_PAYMENT_METHODS.MANUAL ? (
                                                    <HandCoins aria-label={method.name} />
                                                ) : method.name === AUTOMATED_PAYMENT_METHODS.STRIPE ? (
                                                    <CreditCard aria-label={method.name} />
                                                ) : (
                                                    <Banknote />
                                                )}
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

export default CheckoutPaymentForm
