import { notFound, redirect } from "next/navigation"

import { getRegionByCountryCode } from "@/lib/data/regions"
import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import { STORE } from "@/lib/constants"
import { getMe } from "@/lib/data/user"
import AuthTemplate from "@/components/auth/auth-template"

type Props = {
    params: Promise<{ countryCode: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { countryCode } = await params

    const t = await getTranslations("Login.metadata")

    const title = t("title")
    const description = t("description")

    return {
        title,
        description,
        openGraph: {
            url: new URL(countryCode, STORE.baseUrl),
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
            canonical: new URL(`${countryCode}/login`, STORE.baseUrl),
        }
    }
}

const Page = async ({ params }: Props) => {
    const { countryCode } = await params

    const region = await getRegionByCountryCode(countryCode)

    if (!region) notFound()

    const currentUser = await getMe()

    if (currentUser) redirect('/')

    const t = await getTranslations("Login")

    return (
        <div className="max-w-screen-2xl mx-auto px-2 py-12 w-full">
            <AuthTemplate
                region={region}
                loginLabel={t("login-label")}
                submitLabel={t("submit-label")}
                passwordLabel={t("password-label")}
                noAccountLabel={t("no-account-label")}
                registerLabel={t("register-label")}
                alreadyRegisteredLabel={t("already-registered-label")}
                passwordConfirmLabel={t("password-confirm-label")}
                nameLabel={t("name-label")}
            />
        </div>
    )
}

export default Page
