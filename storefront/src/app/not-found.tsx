import { useTranslations } from "next-intl"
import Link from 'next/link'

import { Button } from "@/components/ui/button"

const NotFound = () => {
    const t = useTranslations("NotFound")

    return (
        <main className="flex flex-col gap-10 items-center justify-center text-center min-h-screen max-w-screen-2xl mx-auto w-full px-2 py-16">
            <p className="font-[family-name:var(--font-montserrat)] text-3xl font-medium max-w-xl">{t("page-not-found")}</p>
            <div className="flex items-center gap-5">
                <Link href="/">
                    <Button variant={"link"}>
                        {t("home-page")}
                    </Button>
                </Link>
                <Link href="/contact">
                    <Button variant={"link"}>
                        {t("contact-page")}
                    </Button>
                </Link>
            </div>
        </main>
    )
}

export default NotFound
