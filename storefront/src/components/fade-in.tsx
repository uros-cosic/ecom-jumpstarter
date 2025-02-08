"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from 'framer-motion'
import { ClassNameValue } from "tailwind-merge"
import { cn } from "@/lib/utils"

type Props = {
    children: Readonly<React.ReactNode>
    className?: ClassNameValue
}

const FadeIn = ({ className, children }: Props) => {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [])

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={cn('transition-opacity duration-700', className)}
        >
            {children}
        </motion.div>
    )
}

export default FadeIn
