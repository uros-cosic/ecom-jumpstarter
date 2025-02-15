import { BadgePercent, Command, Gauge, Globe, Newspaper, Package, Package2, PackageSearch, ShoppingBag, TicketPercent, Truck, User } from "lucide-react"

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
        name: "Products",
        url: "/products",
        icon: <PackageSearch />,
    },
    {
        name: "Categories",
        url: "/categories",
        icon: <Package />,
    },
    {
        name: "Collections",
        url: "/collections",
        icon: <Package2 />,
    },
    {
        name: "Users",
        url: "/users",
        icon: <User />,
    },
    {
        name: "Sales",
        url: "/sales",
        icon: <BadgePercent />,
    },
    {
        name: "Discounts",
        url: "/discounts",
        icon: <TicketPercent />,
    },
    {
        name: "Delivery",
        url: "/delivery",
        icon: <Truck />,
    },
    {
        name: "Newsletters",
        url: "/newsletters",
        icon: <Newspaper />,
    },
    {
        name: "Regions",
        url: "/regions",
        icon: <Globe />,
    },
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
                <NavItems items={items} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}

export default SideNav
