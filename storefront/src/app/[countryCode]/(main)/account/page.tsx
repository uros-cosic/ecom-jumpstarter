import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import AccountOverview from "@/components/auth/account-overview"

export async function generateMetadata(): Promise<Metadata> {
    // account shouldn't be indexed - robots

    const t = await getTranslations("Account.metadata")

    const title = t("title")
    const description = t("description")


    return {
        title,
        description,
        openGraph: {
            type: 'website',
            title,
            description
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    }
}

const Page = () => {
    return (
        <AccountOverview />
    )
}

export default Page
