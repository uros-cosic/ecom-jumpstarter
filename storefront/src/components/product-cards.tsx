import { IProduct, IRegion } from '@/lib/types'
import LocalizedLink from './localized-link'
import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { formatCurrency } from '@/lib/utils'

type Props = {
    title: string
    products: IProduct[]
    region: IRegion
}

const ProductCards = async ({ title, products, region }: Props) => {
    const t = await getTranslations("Home")
    const locale = await getLocale()

    return (
        <section className='flex flex-col gap-3 max-w-screen-2xl mx-auto w-full px-2'>
            <h1 className="font-[family-name:var(--font-montserrat)] text-2xl">
                {title}
            </h1>
            <ul className='grid grid-cols-1 lg:grid-cols-4 gap-5'>
                {products.map(prod => (
                    <li key={prod._id}>
                        <ProductCard
                            product={prod}
                            region={region}
                            fromLabel={t("from-label")}
                            locale={locale}
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}

const ProductCard = ({ product, region, fromLabel, locale }: { product: IProduct, region: IRegion, fromLabel: string, locale: string }) => {
    return (
        <div className='bg-white border rounded-md h-96 flex flex-col'>
            <LocalizedLink href={`/product/${product.handle}`} className="relative rounded-t-md max-h-64 min-h-64 h-full w-full overflow-hidden bg-gray-50 hover:opacity-90 transition-opacity">
                <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill={true}
                    style={{ objectFit: 'cover' }}
                />
            </LocalizedLink>
            <div className='flex flex-col gap-2 px-5 py-3 max-h-32 h-full justify-between'>
                <LocalizedLink href={`/product/${product.handle}`} className="hover:underline line-clamp-2 font-medium">
                    {product.name}
                </LocalizedLink>
                <div className="col-span-2 xl:col-span-1 flex flex-col items-start justify-center text-xs lg:text-sm">
                    <span className="font-medium">{fromLabel}:</span>
                    <span className='text-base font-medium'>{formatCurrency(locale, region.currency, product.price)}</span>
                </div>
            </div>
        </div>
    )
}

export default ProductCards
