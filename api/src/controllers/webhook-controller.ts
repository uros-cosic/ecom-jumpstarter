import { Request, Response } from 'express'

import { StripeService } from '../services/stripe'

export const stripeWebhook = async (req: Request, res: Response) => {
    const webhookValidated = await StripeService.validateOrder(req)

    if (webhookValidated) {
        res.status(200).json({ data: 'Webhook recieved' })
        return
    }

    res.status(400).json({ message: 'Webhook error' })
    return
}
