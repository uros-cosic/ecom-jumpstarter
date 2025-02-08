import { STORE } from "@/lib/constants"
import { Facebook, Instagram } from "lucide-react"
import { useTranslations } from "next-intl"
import NewsletterForm from "../forms/newsletter"
import LocalizedLink from "../localized-link"

const data = {
    socials: [
        {
            label: 'Facebook',
            link: 'https://facebook.com',
            icon: Facebook
        },
        {
            label: 'Instagram',
            link: 'https://instagram.com',
            icon: Instagram
        }
    ],

    links: [
        {
            label: 'pages', links: [
                { label: 'sale', href: '/sale' },
                { label: 'collections', href: '/collections' },
                { label: 'categories', href: '/categories' },
                { label: 'contact', href: '/contact' },
            ]
        },
        {
            label: 'policies', links: [
                { label: 'privacy', href: '/policies/privacy' },
                { label: 'refund', href: '/policies/refund' },
                { label: 'terms-of-use', href: '/policies/terms-of-use' },
            ]

        }
    ]
}

const Footer = () => {
    const t = useTranslations("Footer")

    return (
        <footer className="bg-primary text-primary-foreground w-full">
            <div className="flex flex-col gap-5 max-w-screen-2xl px-2 py-10 mt-10 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 mx-auto lg:mx-0 gap-10 py-5">
                    <div className="flex flex-col gap-3 items-center lg:items-start">
                        <p className="uppercase font-bold">{t("socials")}</p>
                        <ul className="flex gap-3 items-center">
                            {
                                data.socials.map(social => (
                                    <li key={social.link}>
                                        <a href={social.link} target="_blank" className="hover:opacity-80">
                                            <social.icon aria-label={social.label} size={26} />
                                        </a>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="flex flex-col gap-3 items-center lg:items-start">
                        <p className="uppercase font-bold">{t("newsletter-heading")}</p>
                        <p className="text-secondary/80 text-sm">{t("newsletter-copywriting")}</p>
                        <NewsletterForm
                            ctaLabel={t("newsletter-cta-label")}
                            successMessage={t("newsletter-success-message")}
                        />
                    </div>
                </div>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent w-full mx-auto" />
                <ul className="py-5 grid grid-cols-1 lg:grid-cols-3 gap-5 mx-auto text-center lg:mx-0 lg:text-left">
                    {
                        data.links.map(item => (
                            <li key={item.label} className="flex flex-col gap-3">
                                <p className="uppercase font-bold">{t(item.label)}</p>
                                <div className="flex flex-col gap-1 items-center lg:items-start">
                                    {
                                        item.links.map(link => (
                                            <LocalizedLink key={link.href} href={link.href} className="hover:underline w-fit">{t(link.label)}</LocalizedLink>
                                        ))
                                    }
                                </div>
                            </li>
                        ))
                    }
                    <li className="flex flex-col gap-3">
                        <p className="uppercase font-bold">{t("contact")}</p>
                        <div className="flex flex-col gap-1 items-center lg:items-start">
                            <LocalizedLink href={"/contact"} className="hover:underline w-fit">{t("contact-us")}</LocalizedLink>
                            <a href={`mailto:${STORE.supportMail}`} className="hover:underline w-fit">{STORE.supportMail}</a>
                        </div>
                    </li>
                </ul>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent w-full mx-auto" />
                <span className="text-sm text-center lg:text-left">&copy; {new Date().getFullYear()} {STORE.name} - {t("all-rights-reserved")}</span>
            </div>
        </footer>
    )
}

export default Footer
