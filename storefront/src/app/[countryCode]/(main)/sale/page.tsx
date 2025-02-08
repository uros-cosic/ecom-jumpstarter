import { Metadata } from "next";
import { notFound } from "next/navigation";

import { STORE } from "@/lib/constants";
import SortSelect from "@/components/sort-select";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import PaginatedProducts from "@/components/paginated-products";
import { getRegionByCountryCode } from "@/lib/data/regions";
import ProductsSkeleton from "@/components/skeletons/products";

export async function generateMetada({ params }: Props): Promise<Metadata> {
    const { countryCode } = await params
    const t = await getTranslations("Sale.metadata")

    return {
        title: t("title"),
        description: t('description'),
        keywords: t('keywords'),
        openGraph: {
            url: new URL(`${countryCode}/sale`, STORE.baseUrl),
            type: 'website',
            title: t('title'),
            description: t('description')
        },
        twitter: {
            card: "summary_large_image",
            title: t('title'),
            description: t('description')
        },
        alternates: {
            canonical: new URL(`${countryCode}/sale`, STORE.baseUrl),
        }
    }
}

type Props = {
    params: Promise<{ countryCode: string; }>
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ params, searchParams }: Props) => {
    const { countryCode } = await params
    const { sort, limit } = await searchParams

    const region = await getRegionByCountryCode(countryCode)

    if (!region) notFound()

    const t = await getTranslations("Sale")

    return (
        <div className="flex flex-col max-w-screen-2xl w-full mx-auto px-2 py-10">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-medium line-clamp-3">
                    {t("heading")}
                </h1>
                <SortSelect
                    items={[
                        { label: t("created-at-descending"), value: "-createdAt" },
                        { label: t("created-at-ascending"), value: "createdAt" },
                        { label: t("price-descending"), value: "-price" },
                        { label: t("price-ascending"), value: "price" },
                    ]}
                    placeholderLabel={t("sort-placeholder-label")}
                    className="max-w-44"
                />
            </div>
            <Separator className="my-4" />
            <Suspense fallback={<ProductsSkeleton />}>
                <PaginatedProducts
                    region={region}
                    sort={sort}
                    limit={limit}
                    sale={true}
                />
            </Suspense>
        </div>
    )
}

export default Page
