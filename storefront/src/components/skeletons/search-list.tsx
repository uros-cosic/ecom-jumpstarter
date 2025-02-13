const SearchListSkeleton = () => {
    return (
        <ul className="flex flex-col py-5 gap-3">
            {new Array(4).fill(null).map((_, idx) => (
                <li key={idx}>
                    <div className="hover:opacity-70 w-full">
                        <div className="w-full">
                            <div className="grid grid-cols-10 gap-3">
                                <div className="col-span-8 lg:col-span-9 flex items-center gap-3">
                                    <div className="rounded-md bg-gray-100 animate-pulse h-12 w-12" />
                                    <span className="rounded-md bg-gray-100 text-gray-100 animate-pulse w-fit line-clamp-2 truncate text-sm lg:text-base">loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default SearchListSkeleton
