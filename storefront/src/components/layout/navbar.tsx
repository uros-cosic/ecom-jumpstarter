import { Menu } from "lucide-react"
import { getTranslations } from "next-intl/server"

import Logo from "../logo"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import CartSheet from "./cart-sheet"
import SearchSheet from "./search-sheet"
import AuthLink from "./auth-link"
import LocalizedLink from "../localized-link"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu"
import { getCollections } from "@/lib/data/collections"
import { cookies } from "next/headers"
import { DEFAULT_REGION } from "@/lib/constants"
import { getRegionByCountryCode } from "@/lib/data/regions"
import { getCategories } from "@/lib/data/categories"
import { IProductCategory } from "@/lib/types"
import { cn } from "@/lib/utils"

const navItems = [
    {
        label: 'collections',
        href: '/collections'
    },
    {
        label: 'categories',
        href: '/categories'
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
    const countryCode = (await cookies()).get('countryCode')?.value ?? DEFAULT_REGION

    const region = await getRegionByCountryCode(countryCode)

    const collections = await getCollections({ region: region!._id, limit: 999 }) ?? []
    const categories = await getCategories({ region: region!._id, limit: 999 }) ?? []

    const map: Record<string, IProductCategory[]> = {}

    for (const category of categories) {
        if (category.parentCategory) {
            (map[category.parentCategory] ??= []).push(category);
        }
    }

    const items = Object.keys(map).map(key => ({
        parentCategory: categories.find(c => c._id === key)!,
        childCategories: map[key]
    }))

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
                                        <SheetClose>
                                            {t(item.label)}
                                        </SheetClose>
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
                                        item.label === 'categories' &&
                                        <ul className="grid grid-cols-4 gap-3 p-4 w-[600px]">
                                            {
                                                items.map(item => (
                                                    <li key={item.parentCategory._id}>
                                                        <LocalizedLink href={`/categories/${item.parentCategory.handle}`} className={cn(navigationMenuTriggerStyle(), "font-bold")}>{item.parentCategory.name}</LocalizedLink>
                                                        <div className="flex flex-col">
                                                            {
                                                                item.childCategories.map(ctg => (
                                                                    <LocalizedLink key={ctg._id} href={`/categories/${ctg.handle}`} className={navigationMenuTriggerStyle()}>{ctg.name}</LocalizedLink>
                                                                ))
                                                            }
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                            {
                                                categories
                                                    .filter(c => !items.find(i => i.parentCategory._id === c._id) && !items.find(i => i.childCategories.find(ctg => ctg._id === c._id)))
                                                    .map((ctg, idx) => (
                                                        <li key={idx}>
                                                            <LocalizedLink key={ctg._id} href={`/categories/${ctg.handle}`} className={navigationMenuTriggerStyle()}>{ctg.name}</LocalizedLink>
                                                        </li>
                                                    ))
                                            }
                                        </ul>
                                    }
                                    {
                                        item.label === 'collections' &&
                                        <ul className="grid grid-cols-4 gap-3 p-4 w-[600px]">
                                            {
                                                collections.map((collection) => (
                                                    <li key={collection._id}>
                                                        <LocalizedLink href={`/collections/${collection.handle}`} className={navigationMenuTriggerStyle()}>{collection.name}</LocalizedLink>
                                                    </li>
                                                ))
                                            }
                                        </ul>
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
        </nav >
    )
}

export default Navbar
