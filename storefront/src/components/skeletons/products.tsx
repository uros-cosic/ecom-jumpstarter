import ProductCardSkeleton from "./product-card"

const ProductsSkeleton = () => {
    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {new Array(4).fill(null).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
            ))}
        </ul>
    )
}

export default ProductsSkeleton
