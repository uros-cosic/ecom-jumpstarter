import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocale } from "next-intl/server"

import { getProductByHandle } from "@/lib/data/products"
import { STORE } from "@/lib/constants"
import JsonLD from "@/components/json-ld"
import { getRegionById } from "@/lib/data/regions"
import ProductTemplate from "@/components/products/product-template"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { handle, countryCode } = await params

    const product = await getProductByHandle(handle)

    if (!product) notFound()

    return {
        title: product.name,
        description: product.description,
        keywords: product.keywords,
        openGraph: {
            url: new URL(`${countryCode}/products/${product.handle}`, STORE.baseUrl),
            type: 'website',
            title: product.name,
            description: product.description,
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description,
        },
        alternates: {
            canonical: new URL(`${countryCode}/products/${product.handle}`, STORE.baseUrl),
        }
    }
}


type Props = {
    params: Promise<{ countryCode: string; handle: string }>
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ params, searchParams }: Props) => {
    const { handle } = await params
    const query = await searchParams

    const product = await getProductByHandle(handle)

    if (!product) notFound()

    const region = await getRegionById(product.region)

    if (!region) notFound()

    const locale = await getLocale()

    return (
        <div className="max-w-screen-2xl w-full px-2 mx-auto py-10">
            <JsonLD
                id={product._id}
                type="product"
                data={{
                    product: {
                        currency: region.currency,
                        description: product.description,
                        image: product.thumbnail,
                        locale,
                        name: product.name,
                        price: product.price,
                        storeName: STORE.name
                    }
                }}
            />
            <ProductTemplate
                variantId={query?.variantId ?? null}
                product={product}
                locale={locale}
                region={region}
            />
        </div>
    )
}

export default Page
