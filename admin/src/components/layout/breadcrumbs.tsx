"use client"

import React from 'react'
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbList, BreadcrumbPage, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbItem } from "../ui/breadcrumb"

const Breadcrumbs = () => {
    const pathname = usePathname()

    const links = pathname.split('/').filter(i => i !== '')

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {
                    !!links.length ? links.map((link, idx) => (
                        <React.Fragment key={link}>
                            {
                                idx !== links.length - 1 ?
                                    <>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href={`/${links.slice(0, links.indexOf(link) + 1).join('/')}`} className='capitalize'>
                                                {link.split('-').join(' ')}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                    </>
                                    :
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className='capitalize'>{link.split('-').join(' ')}</BreadcrumbPage>
                                    </BreadcrumbItem>
                            }
                        </React.Fragment>

                    )) : <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                }
            </BreadcrumbList>
        </Breadcrumb>

    )
}

export default Breadcrumbs
