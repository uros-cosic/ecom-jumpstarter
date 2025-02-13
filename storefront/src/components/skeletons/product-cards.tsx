import ProductCardSkeleton from "./product-card"

const ProductCardsSkeleton = () => {
    return (
        <section className='flex flex-col gap-3 max-w-screen-2xl mx-auto w-full px-2'>
            <h1 className="rounded-md animate-pulse text-gray-100 bg-gray-100 font-[family-name:var(--font-montserrat)] text-2xl w-fit">
                Loading...
            </h1>
            <ul className='grid grid-cols-1 lg:grid-cols-4 gap-3'>
                {new Array(4).fill(null).map((_, idx) => (
                    <li key={idx}>
                        <ProductCardSkeleton />
                    </li>
                ))}
            </ul>
        </section>

    )
}

export default ProductCardsSkeleton
