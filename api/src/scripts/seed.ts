import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { countries, ICountry } from 'countries-list'

import '../config'
import seedData from '../../storage/data/seed-data.json'
import Country from '../models/Country'
import Region from '../models/Region'
import User, { USER_ROLE } from '../models/User'
import PaymentMethod from '../models/PaymentMethod'

const env = (process.env.NODE_ENV || 'development') as keyof typeof seedData

mongoose.connect(process.env.MONGO_URI!)

const seedCountries = async () => {
    try {
        const countryCodes = Object.keys(countries)
        const formattedCountries = []

        for (const code of countryCodes) {
            const country = countries[
                code as keyof typeof countries
            ] as ICountry

            formattedCountries.push({
                name: country.name,
                code: code.toLowerCase(),
                currency: country.currency[0]?.toLowerCase() ?? 'usd',
                languages: country.languages.map((l) => l.toLowerCase()),
            })
        }

        const data = await Country.insertMany(formattedCountries)

        console.log(`Inserted ${data.length} countries`)
    } catch (e) {
        console.error('Error seeding countries', e)
    }
}

const seedRegions = async () => {
    try {
        const regions = seedData[env].regions

        if (!regions.length) throw new Error('No regions data')

        const countries = (
            await Country.find({ code: { $in: ['us', 'rs'] } })
        ).map((c) => String(c._id))

        const data = await Region.insertMany(
            regions.map((r) => ({ ...r, countries }))
        )

        console.log(`Inserted ${data.length} regions`)
    } catch (e) {
        console.error('Error inserting regions', e)
    }
}

const seedUsers = async () => {
    try {
        const users = seedData[env].users

        if (!users.length) throw new Error('No users data')

        const regions = await Region.find({
            name: { $in: users.map((u) => u.region) },
        })

        const formatedUsers = users
            .map((u) => ({
                ...u,
                region: String(regions.find((r) => r.name === u.region)?._id),
                password: bcrypt.hashSync(process.env.SEED_PW!, 12),
                role: USER_ROLE.ADMIN,
            }))
            .filter((u) => u.region !== 'undefined')

        const data = await User.insertMany(formatedUsers)

        console.log(`Inserted ${data.length} users`)
    } catch (e) {
        console.error('Error seeding users', e)
    }
}

const seedPaymentMethods = async () => {
    try {
        const paymentMethods = seedData[env].paymentMethods

        const regions = await Region.find({
            name: { $in: paymentMethods.map((p) => p.region) },
        })

        const formatedPaymentMethods = paymentMethods
            .map((p) => ({
                ...p,
                region: String(regions.find((r) => r.name === p.region)?._id),
            }))
            .filter((p) => p.region !== 'undefined')

        const data = await PaymentMethod.insertMany(formatedPaymentMethods)

        console.log(`Inserted ${data.length} payment methods`)
    } catch (e) {
        console.error('Error seeding payment methods', e)
    }
}

const seed = async () => {
    try {
        await seedCountries()
        await new Promise((r) => setTimeout(r, 2000))
        await seedRegions()
        await new Promise((r) => setTimeout(r, 2000))
        await seedUsers()
        await new Promise((r) => setTimeout(r, 2000))
        await seedPaymentMethods()
    } catch (e) {
        console.error('Error seeding data', e)
    } finally {
        mongoose.connection.close()
    }
}

seed()
