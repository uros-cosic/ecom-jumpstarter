"use client"

import { useState } from "react"

import { CartSheetContext } from "@/lib/context/cart-sheet"


type Props = {
    children: Readonly<React.ReactNode>
}

const CartSheetProvider = ({ children }: Props) => {
    const [open, setOpen] = useState(false)

    return (
        <CartSheetContext.Provider value={{ open, setOpen }}>
            {children}
        </CartSheetContext.Provider>
    )
}

export default CartSheetProvider
