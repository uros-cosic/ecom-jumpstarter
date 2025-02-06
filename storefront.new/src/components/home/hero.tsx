import { useTranslations } from "next-intl"

import { Button } from "../ui/button"
import LocalizedLink from "../localized-link"

const Hero = () => {
    const t = useTranslations("Home.Hero")

    return (
        <section className="max-w-[100vw] min-w-[100vw] w-full bg-gray-100 min-h-[70vh] flex flex-col items-center justify-center gap-5">
            <div className="text-center flex flex-col gap-3">
                <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-bold uppercase">
                    {t("heading")}
                </h1>
                <p>{t("subheading")}</p>
            </div>
            <div className="flex gap-3 items-center">
                <LocalizedLink href="/#">
                    <Button variant={"outline"}>{t("secondary-cta")}</Button>
                </LocalizedLink>
                <LocalizedLink href="/#">
                    <Button>{t("primary-cta")}</Button>
                </LocalizedLink>
            </div>
        </section>
    )
}

export default Hero
