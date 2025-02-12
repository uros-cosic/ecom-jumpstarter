'use client'

import { createContext } from 'react'

export type CartSheetContent = {
    open: boolean
    setOpen: (b: boolean) => void
}

export const CartSheetContext = createContext<CartSheetContent>({
    open: false,
    setOpen: () => {},
})
