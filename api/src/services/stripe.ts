import Stripe from 'stripe'
import { Request } from 'express'

import '../config'
import Order, { IOrder, ORDER_STATUS } from '../models/Order'
import { ICart } from '../models/Cart'
import { STORE } from '../lib/constants'
import Region from '../models/Region'
import Product from '../models/Product'
import Sale, { SALE_TYPE } from '../models/Sale'
import Payment, { PAYMENT_STATUS } from '../models/Payment'
import * as redis from './redis'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export class StripeService {
    static createCheckoutSession = async (
        order: Omit<IOrder, 'cart'> & { cart: ICart }
    ) => {
        try {
            const successUrl = STORE.orderPreviewLink.replace(
                '{{id}}',
                String(order._id)
            )
            const cancelUrl = STORE.cancelUrl

            const region = await Region.findById(order.region)

            if (!region) {
                throw new Error('Invalid region')
            }

            const currency = region.currency

            const lineItemsPromises = order.cart.items.map(async (item) => {
                const product = await Product.findById(item.product).exec()

                if (!product) return null

                let variant = product.variants?.find(
                    (variant) => String(variant._id) === String(item?.variant)
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
                    price_data: {
                        currency: currency,
                        product_data: { name: product.name },
                        unit_amount: price * 100,
                    },
                    quantity: item.quantity,
                }
            })

            const lineItemsResolved = await Promise.all(lineItemsPromises)
            const lineItems = lineItemsResolved.filter((i) => i !== null)

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
                customer_email: order.cart.email,
                metadata: {
                    orderId: String(order._id),
                },
            })

            return session.url
        } catch (e) {
            console.error('Error creating checkout session', e)
        }
    }

    static validateOrder = async (req: Request) => {
        const signature = req.headers['stripe-signature']

        if (!signature) throw new Error('Invalid signature')

        try {
            const event = await stripe.webhooks.constructEventAsync(
                req.body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            )

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object
                const orderId = session.metadata?.orderId

                if (orderId) {
                    const order = await Order.findById(orderId)

                    if (order) {
                        order.status = ORDER_STATUS.COMPLETED

                        if (order.payment) {
                            const payment = await Payment.findById(
                                order.payment
                            )

                            if (payment) {
                                payment.status = PAYMENT_STATUS.COMPLETED

                                await payment.save()
                                await redis.deleteCachedValueByKey(
                                    `${Payment.modelName.toLowerCase()}:${String(payment._id)}`
                                )
                            }
                        }

                        await order.save()
                        await redis.deleteCachedValueByKey(
                            `${Order.modelName.toLowerCase()}:${String(order._id)}`
                        )
                    }
                }
            } else if (
                event.type === 'checkout.session.expired' ||
                event.type === 'checkout.session.async_payment_failed'
            ) {
                const session = event.data.object
                const orderId = session.metadata?.orderId

                if (orderId) {
                    const order = await Order.findById(orderId)

                    if (order) {
                        order.status = ORDER_STATUS.CANCELED

                        if (order.payment) {
                            const payment = await Payment.findById(
                                order.payment
                            )

                            if (payment) {
                                payment.status = PAYMENT_STATUS.FAILED

                                await payment.save()
                                await redis.deleteCachedValueByKey(
                                    `${Payment.modelName.toLowerCase()}:${String(payment._id)}`
                                )
                            }
                        }

                        await order.save()
                        await redis.deleteCachedValueByKey(
                            `${Order.modelName.toLowerCase()}:${String(order._id)}`
                        )
                    }
                }
            }

            return true
        } catch (e) {
            console.error('Webhook error', e)
            return false
        }
    }
}
