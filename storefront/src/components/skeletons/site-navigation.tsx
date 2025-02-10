const SiteNavigationSkeleton = () => {
    return (
        <section className="max-w-screen-2xl w-full px-2 mx-auto">
            <ul className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {
                    new Array(4).fill(null).map((_, idx) => (
                        <li key={idx} className="flex flex-col gap-2 mx-auto items-center lg:mx-0 lg:items-start">
                            <div className="font-[family-name:var(--font-montserrat)] text-lg font-bold uppercase hover:underline w-fit bg-gray-100 animate-pulse rounded-md text-gray-100">Loading...</div>
                            <div className="flex flex-col gap-1">
                                {
                                    new Array(3).fill(null).map((_, idx) => (
                                        <div key={idx} className="font-medium w-fit bg-gray-100 animate-pulse rounded-md text-gray-100">Loading...</div>
                                    ))
                                }
                            </div>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}

export default SiteNavigationSkeleton
