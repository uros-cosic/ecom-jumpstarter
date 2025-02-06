import { ShoppingBag } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "../ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { getOrSetCart } from "@/lib/data/cart"
import LocalizedLink from "../localized-link"

const CartSheet = async () => {
    const t = await getTranslations("Header.Navbar")
    const cart = await getOrSetCart()

    return (
        <Sheet>
            <SheetTrigger className="hover:opacity-80 transition-opacity">
                <ShoppingBag aria-label={t("bag-label")} size={22} />
            </SheetTrigger>
            {!!cart?.items.length ? 'TODO-NON-EMPTY-CART' :
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="text-center">{t("empty-bag-title")}</SheetTitle>
                        <SheetDescription className="text-center">{t("empty-bag-description")}</SheetDescription>
                    </SheetHeader>
                    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-10">
                        <div className="flex items-center justify-center text-center mx-auto h-44 w-44 rounded-full bg-gray-200">
                            <ShoppingBag size={120} className="text-gray-500" />
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                            <LocalizedLink href="/collections">
                                <SheetClose asChild>
                                    <Button className="w-full uppercase font-semibold">{t("shop-collections")}</Button>
                                </SheetClose>
                            </LocalizedLink>
                            <LocalizedLink href="/categories">
                                <SheetClose asChild>
                                    <Button className="w-full uppercase font-semibold">{t("shop-categories")}</Button>
                                </SheetClose>
                            </LocalizedLink>
                        </div>
                    </div>
                </SheetContent>
            }
        </Sheet>

    )
}

export default CartSheet
