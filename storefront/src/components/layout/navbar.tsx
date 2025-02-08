import { Menu } from "lucide-react"
import { getTranslations } from "next-intl/server"

import Logo from "../logo"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import CartSheet from "./cart-sheet"
import SearchSheet from "./search-sheet"
import AuthLink from "./auth-link"
import LocalizedLink from "../localized-link"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu"
import CollectionsNavigationContent from "./collections-navigation-content"
import CategoriesNavigationContent from "./categories-navigation-content"

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
] as const

const dropMenuItems = {
    [navItems[0].label]: true,
    [navItems[1].label]: true
}

const Navbar = async () => {
    const t = await getTranslations("Header.Navbar")

    return (
        <nav className="flex max-w-screen-2xl w-full items-center justify-between z-50">
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
            <NavigationMenu className="hidden lg:block">
                <NavigationMenuList>
                    {navItems.map(item => (
                        <NavigationMenuItem key={item.label}>
                            {!!dropMenuItems[item.label as keyof typeof dropMenuItems]
                                ? <NavigationMenuTrigger>{t(item.label)}</NavigationMenuTrigger>
                                : <LocalizedLink href={item.href} className={navigationMenuTriggerStyle()}>{t(item.label)}</LocalizedLink>}
                            {!!dropMenuItems[item.label as keyof typeof dropMenuItems] && (
                                <NavigationMenuContent>
                                    {
                                        item.label === 'categories' && <CategoriesNavigationContent />
                                    }
                                    {
                                        item.label === 'collections' && <CollectionsNavigationContent />
                                    }
                                </NavigationMenuContent>
                            )}
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
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
