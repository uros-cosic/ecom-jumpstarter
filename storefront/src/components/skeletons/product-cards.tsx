const ProductCardsSkeleton = () => {
    return (
        <section className='flex flex-col gap-5'>
            <h1 className="text-gray-100 bg-gray-100 font-[family-name:var(--font-montserrat)] text-2xl">
                Loading...
            </h1>
            <ul className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                {new Array(4).fill(null).map((_, idx) => (
                    <li key={idx}>
                        <div>
                            {
                                // TODO: ProductCardSkeleton
                            }
                        </div>
                    </li>
                ))}
            </ul>
        </section>

    )
}

export default ProductCardsSkeleton
