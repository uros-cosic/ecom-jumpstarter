import { STORE } from "@/lib/constants"
import { Mail } from "lucide-react"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { countryCode } = await params
    const t = await getTranslations("Contact.metadata")

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
            canonical: new URL(`${countryCode}/contact`, STORE.baseUrl)
        }
    }
}

type Props = {
    params: Promise<{ countryCode: string }>
}

const Page = async () => {
    const t = await getTranslations("Contact")

    return (
        <div className="max-w-4xl mx-auto px-2 py-10 w-full">
            <div className="w-full min-h-[50vh] bg-gray-100 border rounded-md flex overflow-hidden">
                <div className="min-h-[50vh] w-52 bg-gray-200 p-5 flex flex-col gap-5">
                    <p className="font-[family-name:var(--font-montserrat)] text-xl font-medium max-w-xl">{t("contact")}</p>
                    <p className="text-foreground/80 text-sm">{t("contact-description")}</p>
                    <div className="flex flex-col text-sm">
                        <span className="flex items-center gap-2">
                            <Mail size={18} />
                            Email
                        </span>
                        <span className="text-foreground/80">{STORE.supportMail}</span>
                    </div>
                </div>
                <div className="p-5 flex flex-col gap-5">
                    <p className="font-[family-name:var(--font-montserrat)] text-xl font-medium max-w-xl capitalize">{t("company-info")}</p>
                    <p>VAT/EMAIL/ADDRESS...</p>
                </div>
            </div>
        </div>
    )
}

export default Page
