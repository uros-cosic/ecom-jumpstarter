import { Menu } from "lucide-react"
import { getTranslations } from "next-intl/server"

import Logo from "../logo"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import CartSheet from "./cart-sheet"
import SearchSheet from "./search-sheet"
import AuthLink from "./auth-link"
import LocalizedLink from "../localized-link"

const navItems = [
    {
        label: 'collections',
        href: '/collections'
    },
    {
        label: 'categories',
        href: '/catregories'
    },
    {
        label: 'sale',
        href: '/sale'
    },
    {
        label: 'contact',
        href: '/contact'
    },
]

const Navbar = async () => {
    const t = await getTranslations("Header.Navbar")

    return (
        <nav className="flex max-w-screen-2xl w-full items-center justify-between">
            <div className="flex gap-5 items-center">
                <Sheet>
                    <SheetTrigger className="hover:opacity-80 transition-opacity lg:hidden">
                        <Menu size={22} />
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle className="text-center">{t("menu")}</SheetTitle>
                        </SheetHeader>
                        <ul className="flex flex-col gap-5 items-center justify-center min-h-[70vh] max-h-[70vh] overflow-auto">
                            {navItems.map(item => (
                                <li key={item.href}>
                                    <LocalizedLink href={item.href} className="hover:opacity-80 transition-opacity">
                                        {t(item.label)}
                                    </LocalizedLink>
                                </li>
                            ))}
                        </ul>
                    </SheetContent>
                </Sheet>
                <Logo className="text-2xl" />
            </div>
            <ul className="hidden lg:flex items-center gap-5">
                {navItems.map(item => (
                    <li key={item.href}>
                        <LocalizedLink href={item.href} className="hover:opacity-80 transition-opacity">
                            {t(item.label)}
                        </LocalizedLink>
                    </li>
                ))}
            </ul>
            <ul className="flex items-start gap-5">
                <li>
                    <SearchSheet />
                </li>
                <li>
                    <AuthLink />
                </li>
                <li>
                    <CartSheet />
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
