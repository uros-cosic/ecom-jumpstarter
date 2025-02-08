import { Metadata } from "next";
import { notFound } from "next/navigation";

import { STORE } from "@/lib/constants";
import SortSelect from "@/components/sort-select";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import PaginatedProducts from "@/components/paginated-products";
import { getRegionById } from "@/lib/data/regions";
import { getCollectionByHandle } from "@/lib/data/collections";
import ProductsSkeleton from "@/components/skeletons/products";

export async function generateMetada({ params }: Props): Promise<Metadata> {
    const { handle, countryCode } = await params

    const collection = await getCollectionByHandle(handle)

    if (!collection) notFound()

    return {
        title: collection.name,
        description: collection.description,
        keywords: collection.keywords,
        openGraph: {
            url: new URL(`${countryCode}/collections/${collection.handle}`, STORE.baseUrl),
            type: 'website',
            title: collection.name,
            description: collection.description,
        },
        twitter: {
            card: "summary_large_image",
            title: collection.name,
            description: collection.description,
        },
        alternates: {
            canonical: new URL(`${countryCode}/collections/${collection.handle}`, STORE.baseUrl),
        }
    }
}

type Props = {
    params: Promise<{ countryCode: string; handle: string }>
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ params, searchParams }: Props) => {
    const { handle } = await params
    const { sort, limit } = await searchParams

    const collection = await getCollectionByHandle(handle)

    if (!collection) notFound()

    const region = await getRegionById(collection.region)

    if (!region) notFound()

    const t = await getTranslations("Collections")

    return (
        <div className="flex flex-col max-w-screen-2xl w-full mx-auto px-2 py-10">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-medium line-clamp-3">
                    {collection.name}
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
                    productCollection={collection._id}
                    region={region}
                    sort={sort}
                    limit={limit}
                />
            </Suspense>
        </div>
    )
}

export default Page
