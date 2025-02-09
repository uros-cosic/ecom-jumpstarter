import { getTranslations } from "next-intl/server"

import { getProducts } from "@/lib/data/products"
import { IProduct, RequestQuery } from "@/lib/types"
import ProductCards from "../product-cards"
import { getRegionById } from "@/lib/data/regions"

type Props = {
    product: IProduct
}
const SimilarProducts = async ({ product }: Props) => {
    const options: RequestQuery<IProduct> = {
        limit: 5,
        region: product.region
    }

    if (product.productCategory) options.productCategory = product.productCategory
    else if (product.productCollection) options.productCollection = product.productCollection

    const products = await getProducts(options)

    if (!products || !products.length) return null

    const region = await getRegionById(product.region)

    const t = await getTranslations("Product")

    return <ProductCards
        products={products.filter(p => p._id !== product._id).slice(0, 4)}
        region={region!}
        title={t("similar-products-title")}
    />
}

export default SimilarProducts
