import { useTranslations } from "next-intl"

import { IProduct, IRegion } from "@/lib/types"
import { cn } from "@/lib/utils"
import ProductOptions from "./options"
import CartAction from "./cart-action"
import InfoTags from "./info-tags"

type Props = {
    product: IProduct
    region: IRegion
    locale: string
}

const ProductOffer = ({ locale, region, product }: Props) => {
    const t = useTranslations("Product")

    const isAvailable = product.active && product.quantity > 0

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
                <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-medium">
                    {product.name}
                </h1>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                    <div className={cn("h-2 w-2 rounded-full bg-gray-300", {
                        "bg-green-500": isAvailable
                    })} />
                    <span className="capitalize">{isAvailable ? t("product-available") : t("product-not-available")}</span>
                </div>
            </div>
            {!!product.options?.length &&
                <ProductOptions
                    options={product.options}
                />
            }
            <CartAction
                product={product}
                region={region}
                locale={locale}
                quantityLabel={t("quantity-label")}
                minusLabel={t("minus-label")}
                plusLabel={t("plus-label")}
                leftInStockText={t("items-left-in-stock")}
                notInStock={t("not-in-stock")}
                variantLabel={t("variant-label")}
                productLabel={t("product-label")}
                addToBagLabel={t("add-to-bag")}
            />
            <div className="max-w-md w-full">
                <InfoTags />
            </div>
        </div>
    )
}

export default ProductOffer
