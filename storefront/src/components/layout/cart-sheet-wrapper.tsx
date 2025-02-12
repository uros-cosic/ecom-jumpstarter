"use client"

import { useContext } from "react"

import { Sheet } from "../ui/sheet"
import { CartSheetContent, CartSheetContext } from "@/lib/context/cart-sheet"

type Props = {
    children: Readonly<React.ReactNode>
}

const CartSheetWrapper = ({ children }: Props) => {
    const { open, setOpen } = useContext<CartSheetContent>(CartSheetContext)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {children}
        </Sheet>
    )
}

export default CartSheetWrapper
