import { getTranslations } from "next-intl/server"
import { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"

import { STORE } from "@/lib/constants"
import Hero from "@/components/home/hero"
import { getRegionByCountryCode } from "@/lib/data/regions"
import LatestCollection from "@/components/home/latest-collections"
import LatestCategory from "@/components/home/latest-category"
import ProductCardsSkeleton from "@/components/skeletons/product-cards"

type Props = {
    params: Promise<{ countryCode: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { countryCode } = await params
    const t = await getTranslations("Home.metadata")

    const title = t("title")
    const description = t("description")
    const keywords = t("keywords")

    return {
        title,
        description,
        keywords,
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
    }
}


const Home = async ({ params }: Props) => {
    const { countryCode } = await params

    const region = await getRegionByCountryCode(countryCode)

    if (!region) notFound()

    return (
        <div className="flex flex-col gap-10">
            <Hero />
            <Suspense fallback={<ProductCardsSkeleton />}>
                <LatestCollection region={region} />
            </Suspense>
            <Suspense fallback={<ProductCardsSkeleton />}>
                <LatestCategory region={region} />
            </Suspense>
        </div>
    )
}

export default Home
