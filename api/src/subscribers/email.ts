import { calculateMillisecondsToDate, generateRandomString } from '../lib/util'
import Cart, { ICart } from '../models/Cart'
import Discount, { DISCOUNT_TYPE } from '../models/Discount'
import Newsletter, { INewsletter } from '../models/Newsletter'
import Order from '../models/Order'
import Sale, { ISale } from '../models/Sale'
import User, { IUser } from '../models/User'
import { CartService } from '../services/cart'
import EmailService from '../services/email'
import eventBus from '../services/event-bus'
import { NewsletterService } from '../services/newsletter'
import { OrderService } from '../services/order'
import { SaleService } from '../services/sale'
import { UserService } from '../services/user'

// Users

eventBus.on(UserService.Events.CREATED, async (data) => {
    if (process.env.NODE_ENV === 'test') return

    EmailService.sendWelcomeMail(data)
})

eventBus.on(
    UserService.Events.PASSWORD_RESET,
    async (data: { user: IUser; token: string }) => {
        if (process.env.NODE_ENV === 'test') return

        EmailService.sendPasswordResetMail(data.user, data.token)
    }
)

// Orders

eventBus.on(OrderService.Events.COMPLETED, async (data) => {
    if (process.env.NODE_ENV === 'test') return

    EmailService.sendOrderConfirmationMail(data)
})

eventBus.on(OrderService.Events.FULFILLED, async (data) => {
    if (process.env.NODE_ENV === 'test') return

    EmailService.sendOrderConfirmationMail(data)
})

// Carts

eventBus.on(CartService.Events.CREATED, async (data: ICart) => {
    if (process.env.NODE_ENV === 'test') return

    setTimeout(
        async () => {
            try {
                const cart = await Cart.findById(String(data._id)).populate(
                    'customer'
                )

                if (!cart) throw new Error('Non existant cart')

                const order = await Order.findOne({ cart: String(cart._id) })

                if (order)
                    throw new Error('Order has been completed with this cart')

                const email =
                    cart.email ?? (cart.customer as unknown as IUser)?.email

                if (!email) throw new Error('No email belonging to this cart')

                const discountCode = await Discount.create({
                    code: `${generateRandomString().toUpperCase()}10`,
                    type: DISCOUNT_TYPE.PERCENTAGE,
                    percentage: 0.1,
                    usageLimit: 1,
                    validTo: new Date(Date.now() + 24 * 60 * 60 * 1000),
                })

                EmailService.sendCartAbandonmentEmail(
                    cart.toObject(),
                    discountCode.toObject()
                )
            } catch (e) {
                console.error('Error sending cart abandonment email', e)
            }
        },
        4 * 60 * 60 * 1000
    )
})

// Newsletters

eventBus.on(NewsletterService.Events.CREATED, async (data: INewsletter) => {
    if (process.env.NODE_ENV === 'test') return

    try {
        const discountCode = await Discount.create({
            code: `${generateRandomString().toUpperCase()}10`,
            type: DISCOUNT_TYPE.PERCENTAGE,
            percentage: 0.1,
            usageLimit: 1,
        })

        EmailService.sendNewsletterWelcomeMail(data, discountCode)
    } catch (e) {
        console.error(e)
    }
})

// Sales

eventBus.on(SaleService.Events.CREATED, async (data: ISale) => {
    if (process.env.NODE_ENV === 'test') return

    const delay = Math.max(
        data.startDate ? calculateMillisecondsToDate(data.startDate) : 0,
        0
    )

    setTimeout(async () => {
        try {
            const sale = await Sale.findById(String(data._id))

            if (!sale || !sale.isActive())
                throw new Error('Invalid/inactive sale')

            const newsletters = await Newsletter.find({
                active: { $ne: false },
            })

            const users = await User.find({ active: { $ne: false } })

            const emails = [
                ...new Set([
                    ...users.map((u) => u.email),
                    ...newsletters.map((n) => n.email),
                ]),
            ]

            EmailService.sendSaleInfoMail(sale.toObject(), emails)
        } catch (e) {
            console.error('Error sending sale email', e)
        }
    }, delay)
})
