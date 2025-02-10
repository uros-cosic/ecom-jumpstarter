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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { countryCode } = await params

    const t = await getTranslations("Categories.metadata")

    const title = t('title')
    const description = t('description')
    const keywords = t('keywords')

    return {
        title,
        description,
        keywords,
        openGraph: {
            url: new URL(`${countryCode}/categories`, STORE.baseUrl),
            type: 'website',
            title,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        alternates: {
            canonical: new URL(`${countryCode}/categories`, STORE.baseUrl),
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

    const t = await getTranslations("Categories")

    return (
        <div className="flex flex-col max-w-screen-2xl w-full mx-auto px-2 py-10">
            <div className="flex items-end justify-between gap-5">
                <div className="flex flex-col gap-3">
                    <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-medium line-clamp-3">
                        {t("all-categories")}
                    </h1>
                </div>
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
                />
            </Suspense>
        </div>
    )
}

export default Page
