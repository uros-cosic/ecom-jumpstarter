const ProductCardSkeleton = () => {
    return (
        <div className='bg-white border rounded-md h-96 flex flex-col'>
            <div className="relative rounded-t-md max-h-64 min-h-64 h-full w-full overflow-hidden bg-gray-50 hover:opacity-90 transition-opacity" />
            <div className='flex flex-col gap-2 px-5 py-3 max-h-32 h-full justify-between'>
                <div className="hover:underline line-clamp-2 font-medium rounded-md bg-gray-100 text-gray-100 animate-pulse w-fit">
                    Loading...
                </div>
                <div className="col-span-2 xl:col-span-1 flex flex-col items-start justify-center text-xs lg:text-sm rounded-md bg-gray-100 text-gray-100 animate-pulse">
                    <span className="font-medium">Loading...</span>
                    <span className='text-base font-medium'>Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default ProductCardSkeleton
