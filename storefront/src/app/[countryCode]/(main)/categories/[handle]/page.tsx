import { Metadata } from "next";
import { notFound } from "next/navigation";

import LocalizedLink from "@/components/localized-link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { STORE } from "@/lib/constants";
import { getCategoryByHandle, getCategoryById } from "@/lib/data/categories";
import SortSelect from "@/components/sort-select";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import PaginatedProducts from "@/components/paginated-products";
import { getRegionById } from "@/lib/data/regions";
import ProductsSkeleton from "@/components/skeletons/products";

export async function generateMetada({ params }: Props): Promise<Metadata> {
    const { handle, countryCode } = await params

    const category = await getCategoryByHandle(handle)

    if (!category) notFound()

    return {
        title: category.name,
        description: category.description,
        keywords: category.keywords,
        openGraph: {
            url: new URL(`${countryCode}/categories/${category.handle}`, STORE.baseUrl),
            type: 'website',
            title: category.name,
            description: category.description,
        },
        twitter: {
            card: "summary_large_image",
            title: category.name,
            description: category.description,
        },
        alternates: {
            canonical: new URL(`${countryCode}/categories/${category.handle}`, STORE.baseUrl),
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

    const category = await getCategoryByHandle(handle)

    if (!category) notFound()

    const region = await getRegionById(category.region)

    if (!region) notFound()

    let parentCategory = null

    if (category.parentCategory) parentCategory = await getCategoryById(category.parentCategory)

    const t = await getTranslations("Categories")

    return (
        <div className="flex flex-col max-w-screen-2xl w-full mx-auto px-2 py-10">
            <div className="flex items-end justify-between gap-5">
                <div className="flex flex-col gap-3">
                    {!!parentCategory && (
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <LocalizedLink href={`/categories/${parentCategory.handle}`}>{parentCategory.name}</LocalizedLink>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{category.name}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    )}
                    <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-medium line-clamp-3">
                        {category.name}
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
                    productCategory={category._id}
                    region={region}
                    sort={sort}
                    limit={limit}
                />
            </Suspense>
        </div>
    )
}

export default Page
