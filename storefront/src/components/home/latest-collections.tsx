import { getCollections } from "@/lib/data/collections"
import { getProducts } from "@/lib/data/products"
import { IRegion } from "@/lib/types"
import ProductCards from "../product-cards"
import { getTranslations } from "next-intl/server"

type Props = {
    region: IRegion
}

const LatestCollection = async ({ region }: Props) => {
    const latestCollectionData = await getCollections({
        limit: 1,
        sort: "-createdAt",
        region: region!._id
    })

    const latestCollection = latestCollectionData ? latestCollectionData[0] : null

    if (!latestCollection) return null

    const products = await getProducts({
        productCollection: latestCollection._id,
        limit: 4
    })

    if (!products || !products.length) return null

    const t = await getTranslations("Home")

    return (
        <ProductCards
            title={t("latest-collection-label")}
            products={products}
            region={region}
            prefetch={true}
        />
    )
}

export default LatestCollection
