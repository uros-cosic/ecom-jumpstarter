import { User } from "lucide-react"
import { getTranslations } from "next-intl/server"

import LocalizedLink from "../localized-link"
import { getMe } from "@/lib/data/user"

const AuthLink = async () => {
    const t = await getTranslations("Header.Navbar")
    const user = await getMe()

    return (
        <LocalizedLink href={!!user ? '/account' : '/login'} className="hover:opacity-80 transition-opacity">
            <User aria-label={t("account-label")} size={22} />
        </LocalizedLink>

    )
}

export default AuthLink
