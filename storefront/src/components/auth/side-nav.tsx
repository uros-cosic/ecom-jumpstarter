"use client"

import { usePathname } from "next/navigation"
import LocalizedLink from "../localized-link";
import { cn } from "@/lib/utils";
import { logOut } from "@/lib/data/auth";


type Props = {
    items: { label: string; href: string; }[]
    logOutLabel: string
}

const SideNav = ({ items, logOutLabel }: Props) => {
    const pathname = usePathname()

    const handleLogout = () => {
        logOut()
    }

    return (
        <nav className="flex flex-col lg:min-w-44 lg:max-w-44 w-full gap-5 bg-gray-100 px-5 lg:px-10 py-5">
            <ul className="flex flex-row lg:flex-col gap-7 text-sm">
                {items.map(item => (
                    <li key={item.href}>
                        <LocalizedLink href={item.href} className={cn("text-gray-500 hover:underline", {
                            "font-bold": pathname.endsWith(item.href)
                        })}>
                            {item.label}
                        </LocalizedLink>
                    </li>
                ))}
                <li>
                    <button className="text-gray-500 hover:underline" type="button" onClick={handleLogout}>
                        {logOutLabel}
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default SideNav
