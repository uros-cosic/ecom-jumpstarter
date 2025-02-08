import { getProducts, getProductsOnSale } from "@/lib/data/products"
import ProductCard from "./product-card"
import { IRegion } from "@/lib/types"
import PaginationWrapper from "./pagination-wrapper"

type Props = {
    region: IRegion
    limit?: string
    sort?: string
    productCategory?: string
    productCollection?: string
    sale?: boolean
}

const DEFAULT_PAGINATION_LIMIT = 9

const PaginatedProducts = async ({ region, limit, productCategory, productCollection, sort, sale = false }: Props) => {
    const options: {
        limit: number
        sort: string
        productCategory?: string
        productCollection?: string
    } = {
        limit: Number(limit ?? DEFAULT_PAGINATION_LIMIT),
        sort: sort || '-createdAt'
    }

    if (productCategory) options.productCategory = productCategory
    if (productCollection) options.productCollection = productCollection

    const products = sale ? await getProductsOnSale(options) : await getProducts(options)

    if (!products || !products.length) return null

    return (
        <PaginationWrapper canChange={products.length === options.limit}>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {products.map(prod => (
                    <ProductCard
                        key={prod._id}
                        product={prod}
                        region={region}
                    />
                ))}
            </ul>
        </PaginationWrapper>
    )
}

export default PaginatedProducts
