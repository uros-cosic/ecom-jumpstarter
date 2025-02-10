import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"

import SideNav from "@/components/auth/side-nav"
import { getMe } from "@/lib/data/user"

type Props = {
    children: Readonly<React.ReactNode>
}

const items = [
    {
        label: 'overview',
        href: '/account'
    },
    {
        label: 'profile',
        href: '/account/profile'
    },
    {
        label: 'addresses',
        href: '/account/addresses'
    }
]


const Layout = async ({ children }: Props) => {
    const user = await getMe()

    if (!user) redirect('/')

    const t = await getTranslations("Account")

    return (
        <div className="px-2">
            <div className="max-w-5xl min-h-[60vh] mx-auto w-full flex flex-col lg:flex-row bg-gray-50 rounded-md border my-12">
                <SideNav
                    items={items.map(item => ({ ...item, label: t(item.label) }))}
                    logOutLabel={t("log-out-label")}
                />
                <div className="py-5 px-5 lg:px-10 w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
