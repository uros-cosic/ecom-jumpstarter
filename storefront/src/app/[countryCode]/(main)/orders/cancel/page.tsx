import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import LocalizedLink from "@/components/localized-link"
import { Button } from "@/components/ui/button"

export async function generateMetada(): Promise<Metadata> {
    // orders shouldn't be indexable - robots

    const t = await getTranslations("Order.Cancel")

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

const Page = async () => {
    const t = await getTranslations("Order.Cancel")

    return (
        <div className="flex flex-col items-center gap-10 text-center max-w-screen-2xl mx-auto w-full px-2 py-16">
            <p className="font-[family-name:var(--font-montserrat)] text-3xl font-medium max-w-xl">{t("order-canceled")}</p>
            <p className="text-foreground/80">{t("order-canceled-description")}</p>
            <div className="flex items-center gap-5">
                <LocalizedLink href="/">
                    <Button variant={"link"}>
                        {t("home-page")}
                    </Button>
                </LocalizedLink>
                <LocalizedLink href="/contact">
                    <Button variant={"link"}>
                        {t("contact-page")}
                    </Button>
                </LocalizedLink>
            </div>
        </div>
    )
}

export default Page
