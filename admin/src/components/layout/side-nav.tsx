import { BadgePercent, Command, Gauge, Package, Settings2, ShoppingBag, User } from "lucide-react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { STORE } from "@/lib/constants"
import NavItems from "./nav-items"
import Link from "next/link"
import { NavUser } from "./nav-user"
import { getMe } from "@/lib/data/user"
import { notFound } from "next/navigation"

const items = [
    {
        name: "Dashboard",
        url: "/",
        icon: <Gauge />,
    },
    {
        name: "Orders",
        url: "/orders",
        icon: <ShoppingBag />,
    },
    {
        name: "Users",
        url: "/users",
        icon: <User />,
    },
]

const groups = [
    {
        label: 'Product',
        icon: <Package />,
        items: [
            {
                name: "Products",
                url: "/products",
            },
            {
                name: "Categories",
                url: "/categories",
            },
            {
                name: "Collections",
                url: "/collections",
            },
        ]
    },
    {
        label: 'Sale',
        icon: <BadgePercent />,
        items: [
            {
                name: "Sales",
                url: "/sales",
            },
            {
                name: "Discounts",
                url: "/discounts",
            },
        ]
    },
    {
        label: 'Other',
        icon: <Settings2 />,
        items: [
            {
                name: "Regions",
                url: "/regions",
            },
            {
                name: "Delivery",
                url: "/delivery",
            },
            {
                name: "Newsletters",
                url: "/newsletters",
            },
        ]
    }
]

const SideNav = async ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const user = await getMe()

    if (!user) return notFound()

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{STORE.name}</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavItems items={items} groups={groups} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}

export default SideNav
