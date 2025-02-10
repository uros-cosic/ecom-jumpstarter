import { useTranslations } from 'next-intl'

import { IProduct, IRegion } from '@/lib/types'
import ImageSwiper from './image-swiper'
import ProductOffer from './product-offer'
import ProductDetails from './product-details'
import { Suspense } from 'react'
import SimilarProducts from './similar-products'
import ProductCardsSkeleton from '../skeletons/product-cards'
import FadeIn from '../fade-in'

type Props = {
    variantId: string | null
    product: IProduct
    region: IRegion
    locale: string
}

const ProductTemplate = ({ locale, product, region, variantId }: Props) => {
    const t = useTranslations('Product')

    return (
        <div className='flex flex-col gap-20'>
            <div className='relative flex flex-col lg:flex-row lg:justify-between gap-20'>
                <div className='w-full lg:w-1/2'>
                    <ImageSwiper
                        className="min-h-[50vh] max-h-[50vh] h-full"
                        images={product.images.length ? product.images : [product.thumbnail]}
                        sizes="(max-width: 1023px) 100vw, 50vw"
                        productLabel={t("product-label")}
                    />
                </div>
                <div className='w-full lg:w-1/2'>
                    <ProductOffer
                        variantId={variantId}
                        product={product}
                        region={region}
                        locale={locale}
                    />
                </div>
            </div>
            {!!product.details &&
                <ProductDetails
                    details={product.details}
                />
            }
            <Suspense fallback={<ProductCardsSkeleton />}>
                <FadeIn>
                    <SimilarProducts
                        product={product}
                    />
                </FadeIn>
            </Suspense>
        </div>
    )
}

export default ProductTemplate
