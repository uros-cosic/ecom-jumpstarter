import { useTranslations } from "next-intl"
import Image from "next/image"

import LocalizedLink from "../localized-link"
import { Button } from "../ui/button"

const InfoSection = () => {
    const t = useTranslations("Home.InfoSection")

    return (
        <section className="w-full h-96 bg-secondary mt-20">
            <div className="flex lg:gap-10 justify-between items-end max-w-screen-2xl mx-auto px-2 w-full h-full">
                <div className="flex flex-col justify-evenly gap-5 lg:w-1/2 h-full py-5">
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-3">
                        <h2 className="font-[family-name:var(--font-montserrat)] text-xl font-bold uppercase">
                            {t("heading")}
                        </h2>
                        <p>{t("copywriting")}</p>
                    </div>
                    <LocalizedLink href="/contact">
                        <Button className="w-full lg:max-w-44">{t("cta-label")}</Button>
                    </LocalizedLink>
                </div>
                <div className="hidden lg:block relative h-[26rem] w-1/2">
                    <Image
                        // Upload your own image
                        src="https://static.vecteezy.com/system/resources/thumbnails/046/496/611/small_2x/handsome-young-man-pointing-away-png.png"
                        alt="temp"
                        fill
                        style={{ objectFit: 'contain', objectPosition: '50% 0%' }}
                        sizes="50vw"
                    />
                </div>
            </div>
        </section>
    )
}

export default InfoSection
