import Image from "next/image"

import { IProduct, IRegion } from "@/lib/types"
import LocalizedLink from "./localized-link"
import { formatCurrency } from "@/lib/utils"
import { getLocale, getTranslations } from "next-intl/server"
import { getProductPrice } from "@/lib/data/products"

type Props = {
    product: IProduct,
    region: IRegion,
    prefetch?: boolean
}

const ProductCard = async ({ product, region, prefetch = false }: Props) => {
    const t = await getTranslations("Product")
    const locale = await getLocale()

    const price = await getProductPrice(product._id)

    return (
        <div className='bg-white border rounded-md h-96 flex flex-col'>
            <LocalizedLink prefetch={prefetch} href={`/products/${product.handle}`} className="relative rounded-t-md max-h-64 min-h-64 h-full w-full overflow-hidden bg-gray-50 hover:opacity-90 transition-opacity">
                <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill={true}
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1023px) 100vw, 25vw"
                />
            </LocalizedLink>
            <div className='flex flex-col gap-2 px-5 py-3 max-h-32 h-full justify-between'>
                <LocalizedLink href={`/products/${product.handle}`} className="hover:underline line-clamp-2 font-medium">
                    {product.name}
                </LocalizedLink>
                <div className="col-span-2 xl:col-span-1 flex flex-col items-start justify-center text-xs lg:text-sm">
                    <span className="font-medium">{t("from-label")}:</span>
                    <span className='text-base font-medium'>{formatCurrency(locale, region.currency, price?.discountedPrice ?? product.price)}</span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard
