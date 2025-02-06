import { getCategories } from "@/lib/data/categories"
import { getProducts } from "@/lib/data/products"
import { IRegion } from "@/lib/types"
import ProductCards from "../product-cards"
import { getTranslations } from "next-intl/server"

type Props = {
    region: IRegion
}

const LatestCategory = async ({ region }: Props) => {
    const latestCategoryData = await getCategories({
        limit: 1,
        sort: "-createdAt",
        region: region!._id
    })

    const latestCategory = latestCategoryData ? latestCategoryData[0] : null

    if (!latestCategory) return null

    const products = await getProducts({
        productCollection: latestCategory._id,
        limit: 4
    })

    if (!products) return null

    const t = await getTranslations("Home")

    return (
        <ProductCards
            title={t("latest-category-label")}
            products={products}
            region={region}
        />
    )
}

export default LatestCategory
