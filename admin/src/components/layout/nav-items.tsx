import Link from "next/link"

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, } from "../ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { ChevronRight } from "lucide-react"

type Props = {
    items: {
        name: string
        url: string
        icon: React.ReactNode
    }[]

    groups: {
        label: string
        icon?: React.ReactNode
        items: {
            name: string
            url: string
        }[]
    }[]
}

const NavItems = ({ items, groups }: Props) => {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild>
                            <Link href={item.url}>
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                {groups.map(group => (
                    <Collapsible
                        key={group.label}
                        asChild
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={group.label}>
                                    {group.icon && group.icon}
                                    <span>{group.label}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {group.items.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.name}>
                                            <SidebarMenuSubButton asChild>
                                                <Link href={subItem.url}>
                                                    <span>{subItem.name}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default NavItems
