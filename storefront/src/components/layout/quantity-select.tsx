"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { addToCart, PopulatedCartItem } from "@/lib/data/cart"
import { toast } from "sonner"

type Props = {
    item: PopulatedCartItem
}

const QuantitySelect = ({ item }: Props) => {
    const [loading, setLoading] = useState(false)

    const handleChange = async (val: string) => {
        if (+val === item.quantity) return

        setLoading(true)

        const newValue = Math.abs(item.quantity - Number(val)) * (item.quantity > +val ? -1 : 1)

        const [, err] = await addToCart({ ...item, quantity: newValue })

        if (err) toast.error(err)

        setLoading(false)
    }

    const availableQuantity = !item.variant ? item.product.quantity + 1 : item.product.variants!.find(v => v._id === item.variant)!.quantity + 1
    const maxQuantity = Math.min(availableQuantity, Math.max(availableQuantity, 10))

    return (
        <Select disabled={loading} value={item.quantity.toString()} onValueChange={handleChange}>
            <SelectTrigger className="h-7 w-16">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {
                    new Array(maxQuantity)
                        .fill(null)
                        .map((_, idx) => <SelectItem key={idx} value={idx.toString()}>{idx}</SelectItem>)
                }
            </SelectContent>
        </Select>

    )
}

export default QuantitySelect
