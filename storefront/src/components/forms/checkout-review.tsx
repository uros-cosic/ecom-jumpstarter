"use client"

import { ProductPopulatedCart, removeCartId } from "@/lib/data/cart"
import { checkoutReviewFormSchema, checkoutReviewFormSchemaValues } from "@/lib/forms/checkout-review"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form } from "../ui/form"
import { Button } from "../ui/button"
import { createOrder } from "@/lib/data/orders"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Props = {
    cart: ProductPopulatedCart
    submitLabel: string
}

const CheckoutReviewForm = ({ cart, submitLabel }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<checkoutReviewFormSchemaValues>({
        resolver: zodResolver(checkoutReviewFormSchema),
        defaultValues: {
            cart: cart._id,
            region: cart.region,
            customer: cart.customer ?? undefined
        }
    })

    const router = useRouter()

    const onSubmit = async (values: checkoutReviewFormSchemaValues) => {
        setLoading(true)

        const [data, err] = await createOrder(values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        await removeCartId()

        if (data!.stripeSessionUrl) {
            router.push(data!.stripeSessionUrl)
            setLoading(false)
            return
        }

        router.push(`/orders/${data!._id}`)

        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Button type="submit" disabled={loading} aria-disabled={loading} className="min-w-44">{submitLabel}</Button>
            </form>
        </Form>
    )
}

export default CheckoutReviewForm
