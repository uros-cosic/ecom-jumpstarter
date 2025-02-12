import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { STORE } from "@/lib/constants"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { countryCode } = await params

    const t = await getTranslations("Policies.Refund.metadata")

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
        alternates: {
            canonical: new URL(`${countryCode}/policies/refund`, STORE.baseUrl)
        }
    }
}

type Props = {
    params: Promise<{ countryCode: string }>
}

const Page = async () => {
    const t = await getTranslations("Policies.Refund")

    return (
        <div className="max-w-4xl px-2 mx-auto w-full flex flex-col gap-5 py-10">
            <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-medium">
                {t("heading")}
            </h1>
        </div>
    )
}

export default Page
