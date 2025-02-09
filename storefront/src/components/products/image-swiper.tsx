"use client"

import { useState } from "react"
import { ClassNameValue } from "tailwind-merge"
import Image from 'next/image'

import { cn } from "@/lib/utils"
import { Lens } from "../lens"

type Props = {
    images: string[]
    sizes: string
    productLabel: string
    className?: ClassNameValue
}

const ImageSwiper = ({ images, sizes, className, productLabel }: Props) => {
    const [image, setImage] = useState(images[0])

    return (
        <div className="relative w-full flex flex-col gap-3">
            <Lens>
                <div className={cn("relative bg-gray-50 w-full h-full border rounded-md flex items-center justify-center overflow-hidden", className)}>
                    <Image
                        src={image}
                        alt={productLabel}
                        priority={true}
                        decoding="sync"
                        loading="eager"
                        fill
                        style={{ objectFit: "contain" }}
                        quality={100}
                        sizes={sizes}
                    />
                </div>
            </Lens>
            <ul className="flex gap-3 overflow-x-auto max-w-full">
                {
                    images.map((img, idx) => (
                        <li
                            key={idx}
                            className="relative h-20 w-20 bg-gray-50 rounded-md border flex items-center justify-center cursor-pointer overflow-hidden"
                            onClick={() => setImage(images[idx])}
                        >
                            <Image
                                src={img}
                                alt={`${productLabel} ${idx}`}
                                fill
                                style={{ objectFit: "contain" }}
                                quality={75}
                                sizes="80px"
                            />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ImageSwiper
