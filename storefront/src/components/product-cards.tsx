import { IProduct, IRegion } from '@/lib/types'
import ProductCard from './product-card'

type Props = {
    title: string
    products: IProduct[]
    region: IRegion
    prefetch?: boolean
}

const ProductCards = ({ title, products, region, prefetch = false }: Props) => {
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
                            prefetch={prefetch}
                        />
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default ProductCards
