import path from 'path'
import fs from 'fs/promises'
import FormData from 'form-data'
import Mailgun, { MailgunMessageData } from 'mailgun.js'
import Handlebars from 'handlebars'
import i18next from 'i18next'

import { IUser } from '../models/User'
import Region from '../models/Region'
import Country from '../models/Country'
import { COLORS, STORE } from '../lib/constants'
import { IOrder, PopulatedOrder } from '../models/Order'
import Product from '../models/Product'
import Sale, { ISale, SALE_TYPE } from '../models/Sale'
import { formatCurrency, formatDate } from '../lib/util'
import Currency from '../models/Currency'
import { ICart } from '../models/Cart'
import { IDiscount } from '../models/Discount'
import { INewsletter } from '../models/Newsletter'

const mailgun = new Mailgun(FormData)
const mg = mailgun.client({
    username: process.env.MAILGUN_API_USERNAME!,
    key: process.env.MAILGUN_API_KEY!,
    //url: process.env.MAILGUN_API_URL!,
})

export type SendMailOptions = Pick<
    MailgunMessageData,
    'to' | 'subject' | 'text' | 'html'
>

class EmailService {
    private sendEmail = async (options: SendMailOptions) => {
        if (process.env.NODE_ENV === 'test') return

        try {
            await mg.messages.create(process.env.MAIL_DOMAIN!, {
                from: `<${process.env.NO_REPLY_MAIL!}>`,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html!,
            })
        } catch (e) {
            console.error('Error sending mail', e)
        }
    }

    sendWelcomeMail = async (data: IUser) => {
        try {
            const region = await Region.findById(data.region)

            let locale = 'en'

            if (region && region.countries.length) {
                const country = await Country.findById(region.countries[0])

                if (country) locale = country.iso_2.toLowerCase()
            }

            const templatePath = path.join(
                process.cwd(),
                'storage',
                'mail-templates',
                'welcome-mail.hbs'
            )

            const templateContent = await fs.readFile(templatePath, 'utf-8')

            const template = Handlebars.compile(templateContent)

            const templateData = {
                lang: locale,
                primaryColor: COLORS.primary,
                primaryForegroundColor: COLORS.primaryForeground,
                welcomeHeading: i18next.t('emails.welcome.welcome-heading', {
                    lng: locale,
                    field: STORE.name,
                }),
                greetHeading: i18next.t('emails.welcome.greet-heading', {
                    lng: locale,
                    field: data.name,
                }),
                greetMessage: i18next.t('emails.welcome.greet-message', {
                    lng: locale,
                }),
                supportContactMessage: i18next.t(
                    'emails.welcome.support-contact-message',
                    { lng: locale }
                ),
                cheersWord: i18next.t('words.cheers', { lng: locale }),
                companyTeam: `${i18next.t('words.team', { lng: locale })} ${STORE.name}`,
                year: new Date().getFullYear(),
                companyName: STORE.name,
                allRightsReserved: i18next.t('words.all-rights-reserved', {
                    lng: locale,
                }),
                warningMessage: i18next.t('emails.welcome.warning-message', {
                    lng: locale,
                }),
                contactUsHere: i18next.t('words.contact-us-here', {
                    lng: locale,
                }),
                contactLink: STORE.contactLink,
            }

            const htmlContent = template(templateData)

            if (process.env.NODE_ENV === 'test') return htmlContent

            this.sendEmail({
                html: htmlContent,
                to: data.email,
                subject: i18next.t('emails.welcome.subject', {
                    lng: locale,
                    field: STORE.name,
                }),
            })
        } catch (e) {
            console.error('Error sending welcome mail', e)
        }
    }

    sendOrderConfirmationMail = async (data: PopulatedOrder) => {
        try {
            let locale = 'en'
            let currency = 'usd'

            const region = await Region.findById(data.region)

            if (region && region.countries.length) {
                const country = await Country.findById(region.countries[0])

                if (country) locale = country.iso_2.toLowerCase()
            }

            if (region && region.currency) {
                const c = await Currency.findById(region.currency)

                if (c) currency = c.code
            }

            const templatePath = path.join(
                process.cwd(),
                'storage',
                'mail-templates',
                'order-confirmation-mail.hbs'
            )

            const templateContent = await fs.readFile(templatePath, 'utf-8')

            const template = Handlebars.compile(templateContent)

            const productsPromises = data.cart.items
                .map(async (item) => {
                    const product = await Product.findById(item.product)
                        .populate('variants')
                        .exec()

                    if (!product) return null

                    let variant = product.variants?.find(
                        (variant) =>
                            String(variant._id) === String(item?.variant)
                    )

                    let price = variant?.price ?? product.price

                    // Check if there is an active sale for the product
                    const sale = await Sale.findOne({
                        products: item.product,
                    }).exec()

                    if (sale && sale.isActive()) {
                        if (sale.type === SALE_TYPE.FIXED)
                            price -= sale.discountAmount || 0
                        if (sale.type === SALE_TYPE.PERCENTAGE)
                            price -= price * (sale.discountPercentage || 0)
                    }

                    return {
                        thumbnail: product.thumbnail,
                        price: formatCurrency(locale, currency, price),
                        quantity: item.quantity,
                        name: product.name,
                    }
                })
                .filter((p) => p)

            const products = await Promise.all(productsPromises)

            const templateData = {
                lang: locale,
                primaryColor: COLORS.primary,
                primaryForegroundColor: COLORS.primaryForeground,
                orderConfirmationHeading: i18next.t(
                    'emails.order-confirmation.heading',
                    { lng: locale }
                ),
                thankYouMessage: i18next.t(
                    'emails.order-confirmation.thank-you-message',
                    { lng: locale }
                ),
                orderSummaryIntro: i18next.t(
                    'emails.order-confirmation.order-summary-intro',
                    { lng: locale }
                ),
                products,
                productTableHeaderName: i18next.t(
                    'emails.order-confirmation.table-header-name',
                    { lng: locale }
                ),
                productTableHeaderQuantity: i18next.t(
                    'emails.order-confirmation.table-header-quantity',
                    { lng: locale }
                ),
                productTableHeaderPrice: i18next.t(
                    'emails.order-confirmation.table-header-price',
                    { lng: locale }
                ),
                totalLabel: i18next.t('emails.order-confirmation.total-label', {
                    lng: locale,
                }),
                totalPrice: formatCurrency(
                    locale,
                    currency,
                    data.cart.totalPrice
                ),
                supportMessage: i18next.t(
                    'emails.order-confirmation.support-message',
                    { lng: locale }
                ),
                viewOrderButton: i18next.t(
                    'emails.order-confirmation.button-label',
                    { lng: locale }
                ),
                orderDetailsLink: STORE.orderPreviewLink.replace(
                    '{{id}}',
                    String(data._id)
                ),
                closingMessage: i18next.t(
                    'emails.order-confirmation.closing-message',
                    { lng: locale }
                ),
                companyTeam: `${i18next.t('words.team', { lng: locale })} ${STORE.name}`,
                year: new Date().getFullYear(),
                companyName: STORE.name,
                allRightsReserved: i18next.t('words.all-rights-reserved', {
                    lng: locale,
                }),
                warningMessage: i18next.t(
                    'emails.order-confirmation.warning-message',
                    {
                        lng: locale,
                    }
                ),
                contactUsHere: i18next.t('words.contact-us-here', {
                    lng: locale,
                }),
                contactLink: STORE.contactLink,
            }

            const htmlContent = template(templateData)

            if (process.env.NODE_ENV === 'test') return htmlContent

            this.sendEmail({
                subject: i18next.t('emails.order-confirmation.subject', {
                    lng: locale,
                }),
                to: data.cart.email,
            })
        } catch (e) {
            console.error('Error sending order confirmation mail', e)
        }
    }

    sendOrderFulfillmentMail = async (
        data: Omit<IOrder, 'cart'> & { cart: ICart }
    ) => {
        try {
            let locale = 'en'

            const region = await Region.findById(data.region)

            if (region && region.countries.length) {
                const country = await Country.findById(region.countries[0])

                if (country) locale = country.iso_2.toLowerCase()
            }

            const templatePath = path.join(
                process.cwd(),
                'storage',
                'mail-templates',
                'order-fulfillment-mail.hbs'
            )

            const templateContent = await fs.readFile(templatePath, 'utf-8')

            const template = Handlebars.compile(templateContent)

            const templateData = {
                lang: locale,
                primaryColor: COLORS.primary,
                primaryForegroundColor: COLORS.primaryForeground,
                fulfillmentHeading: i18next.t(
                    'emails.order-fulfillment.heading',
                    {
                        lng: locale,
                    }
                ),
                orderFulfilledMessage: i18next.t(
                    'emails.order-fulfillment.fulfilled-message',
                    { lng: locale }
                ),
                shipmentPreparationMessage: i18next.t(
                    'emails.order-fulfillment.preparation-message',
                    { lng: locale }
                ),
                orderNumberLabel: i18next.t(
                    'emails.order-fulfillment.number-label',
                    { lng: locale }
                ),
                orderNumber: String(data._id),
                orderDateLabel: i18next.t(
                    'emails.order-fulfillment.date-label',
                    {
                        lng: locale,
                    }
                ),
                orderDate: formatDate(data.createdAt, locale),
                supportMessage: i18next.t(
                    'emails.order-fulfillment.support-message',
                    { lng: locale }
                ),
                closingMessage: i18next.t(
                    'emails.order-fulfillment.closing-message',
                    { lng: locale }
                ),
                companyTeam: `${i18next.t('words.team', { lng: locale })} ${STORE.name}`,
                year: new Date().getFullYear(),
                companyName: STORE.name,
                allRightsReserved: i18next.t('words.all-rights-reserved', {
                    lng: locale,
                }),
                warningMessage: i18next.t(
                    'emails.order-fulfillment.warning-message',
                    {
                        lng: locale,
                    }
                ),
                contactUsHere: i18next.t('words.contact-us-here', {
                    lng: locale,
                }),
                contactLink: STORE.contactLink,
            }

            const htmlContent = template(templateData)

            if (process.env.NODE_ENV === 'test') return htmlContent

            this.sendEmail({
                subject: i18next.t('emails.order-fulfillment.subject', {
                    lng: locale,
                }),
                to: data.cart.email,
            })
        } catch (e) {
            console.error('Error sending order fulfillment mail', e)
        }
    }

    sendCartAbandonmentEmail = async (data: ICart, discountCode: IDiscount) => {
        try {
            let locale = 'en'

            const region = await Region.findById(data.region)

            if (region && region.countries.length) {
                const country = await Country.findById(region.countries[0])

                if (country) locale = country.iso_2.toLowerCase()
            }

            const cartItems = await Promise.all(
                data.items
                    .map(async (i) => {
                        const prod = await Product.findById(i.product)

                        if (!prod) return null

                        return {
                            name: prod.name,
                            quantity: i.quantity,
                        }
                    })
                    .filter((i) => i)
            )

            const templatePath = path.join(
                process.cwd(),
                'storage',
                'mail-templates',
                'cart-abandonment-mail.hbs'
            )

            const templateContent = await fs.readFile(templatePath, 'utf-8')

            const template = Handlebars.compile(templateContent)

            const templateData = {
                lang: locale,
                primaryColor: COLORS.primary,
                primaryForegroundColor: COLORS.primaryForeground,
                heading: i18next.t('emails.cart-abandonment.heading', {
                    lng: locale,
                }),
                subheading: i18next.t('emails.cart-abandonment.subheading', {
                    lng: locale,
                }),
                abandonmentIntro: i18next.t('emails.cart-abandonment.intro', {
                    lng: locale,
                    field: '24h',
                }),
                discountLabel: i18next.t(
                    'emails.cart-abandonment.discount-label',
                    { lng: locale }
                ),
                discountCode: discountCode.code,
                cartIntro: i18next.t('emails.cart-abandonment.cart-intro', {
                    lng: locale,
                }),
                tableName: i18next.t(
                    'emails.cart-abandonment.table-header-name',
                    { lng: locale }
                ),
                tableQuantity: i18next.t(
                    'emails.cart-abandonment.table-header-quantity',
                    { lng: locale }
                ),
                cartItems,
                ctaMessage: i18next.t('emails.cart-abandonment.cta-message', {
                    lng: locale,
                }),
                returnToCart: i18next.t(
                    'emails.cart-abandonment.return-to-cart',
                    { lng: locale }
                ),
                cartLink: STORE.link,
                supportMessage: i18next.t(
                    'emails.cart-abandonment.support-message',
                    { lng: locale }
                ),
                companyTeam: `${i18next.t('words.team', { lng: locale })} ${STORE.name}`,
                year: new Date().getFullYear(),
                companyName: STORE.name,
                allRightsReserved: i18next.t('words.all-rights-reserved', {
                    lng: locale,
                }),
                contactUsHere: i18next.t('words.contact-us-here', {
                    lng: locale,
                }),
                contactLink: STORE.contactLink,
            }

            const htmlContent = template(templateData)

            if (process.env.NODE_ENV === 'test') return htmlContent

            this.sendEmail({
                subject: i18next.t('emails.cart-abandonment.subject', {
                    lng: locale,
                }),
                to: data.email,
            })
        } catch (e) {
            console.error('Error sending cart abandonment mail', e)
        }
    }

    sendNewsletterWelcomeMail = async (
        data: INewsletter,
        discountCode: IDiscount
    ) => {
        try {
            let locale = 'en'

            const region = await Region.findById(data.region)

            if (region && region.countries.length) {
                const country = await Country.findById(region.countries[0])

                if (country) locale = country.iso_2.toLowerCase()
            }

            const templatePath = path.join(
                process.cwd(),
                'storage',
                'mail-templates',
                'newsletter-welcome-mail.hbs'
            )

            const templateContent = await fs.readFile(templatePath, 'utf-8')

            const template = Handlebars.compile(templateContent)

            const templateData = {
                lang: locale,
                primaryColor: COLORS.primary,
                primaryForegroundColor: COLORS.primaryForeground,
                heading: i18next.t('emails.newsletter-welcome.heading', {
                    lng: locale,
                }),
                subheading: i18next.t('emails.newsletter-welcome.subheading', {
                    lng: locale,
                }),
                welcomeMessage: i18next.t(
                    'emails.newsletter-welcome.welcome-message',
                    { lng: locale }
                ),
                discountLabel: i18next.t(
                    'emails.newsletter-welcome.discount-label',
                    { lng: locale }
                ),
                discountCode: discountCode.code,
                ctaMessage: i18next.t('emails.newsletter-welcome.cta-message', {
                    lng: locale,
                }),
                shopLink: STORE.link,
                shopNow: i18next.t('emails.newsletter-welcome.shop-now', {
                    lng: locale,
                }),
                supportMessage: i18next.t(
                    'emails.newsletter-welcome.support-message',
                    { lng: locale }
                ),
                companyTeam: `${i18next.t('words.team', { lng: locale })} ${STORE.name}`,
                year: new Date().getFullYear(),
                companyName: STORE.name,
                allRightsReserved: i18next.t('words.all-rights-reserved', {
                    lng: locale,
                }),
                contactUsHere: i18next.t('words.contact-us-here', {
                    lng: locale,
                }),
                contactLink: STORE.contactLink,
            }

            const htmlContent = template(templateData)

            if (process.env.NODE_ENV === 'test') return htmlContent

            this.sendEmail({
                subject: i18next.t('emails.newsletter-welcome.subject', {
                    lng: locale,
                }),
                to: data.email,
            })
        } catch (e) {
            console.error('Error sending newsletter welcome mail', e)
        }
    }

    sendSaleInfoMail = async (data: ISale, emails: string[]) => {
        try {
            let locale = 'en'

            const region = await Region.findById(data.region)

            if (region && region.countries.length) {
                const country = await Country.findById(region.countries[0])

                if (country) locale = country.iso_2.toLowerCase()
            }

            const templatePath = path.join(
                process.cwd(),
                'storage',
                'mail-templates',
                'sale-info-mail.hbs'
            )

            const templateContent = await fs.readFile(templatePath, 'utf-8')

            const template = Handlebars.compile(templateContent)

            const templateData = {
                lang: locale,
                primaryColor: COLORS.primary,
                primaryForegroundColor: COLORS.primaryForeground,
                heading: i18next.t('emails.sale-info.heading', { lng: locale }),
                subheading: i18next.t('emails.sale-info.subheading', {
                    lng: locale,
                }),
                saleIntro: i18next.t('emails.sale-info.sale-intro', {
                    lng: locale,
                }),
                saleImage: data.thumbnail,
                saleImageAlt: data.name,
                ctaMessage: i18next.t('emails.sale-info.cta-message', {
                    lng: locale,
                }),
                ctaButtonText: i18next.t('emails.sale-info.cta-button-text', {
                    lng: locale,
                }),
                saleLink: STORE.saleLink.replace('{{id}}', String(data._id)),
                supportMessage: i18next.t('emails.sale-info.support-message', {
                    lng: locale,
                }),
                companyTeam: `${i18next.t('words.team', { lng: locale })} ${STORE.name}`,
                year: new Date().getFullYear(),
                companyName: STORE.name,
                allRightsReserved: i18next.t('words.all-rights-reserved', {
                    lng: locale,
                }),
                contactUsHere: i18next.t('words.contact-us-here', {
                    lng: locale,
                }),
                contactLink: STORE.contactLink,
            }

            const htmlContent = template(templateData)

            if (process.env.NODE_ENV === 'test') return htmlContent

            this.sendEmail({
                subject: i18next.t('emails.sale-info.subject', {
                    lng: locale,
                }),
                to: emails,
            })
        } catch (e) {
            console.error('Error sending sale info mail', e)
        }
    }
}

const emailService = new EmailService()

export default emailService
