import { ClassNameValue } from 'tailwind-merge'

import { cn } from '@/lib/utils'
import Link from 'next/link'

type Props = {
    className?: ClassNameValue
}

const Logo = ({ className }: Props) => {
    return (
        <Link href="/" className={cn("hover:opacity-80 transition-opacity", className)}>
            <span className="font-[family-name:var(--font-montserrat)] font-medium tracking-widest">
                LOGO
            </span>
        </Link>
    )
}

export default Logo
