import CurrencyList from 'currency-list'
import { getData } from 'country-list'
import mongoose from 'mongoose'

import '../config'
import seedData from '../../storage/data/seed-data.json'
import Currency from '../models/Currency'
import Country from '../models/Country'
import Region from '../models/Region'
import User from '../models/User'

const env = (process.env.NODE_ENV || 'development') as keyof typeof seedData

mongoose.connect(process.env.MONGO_URI!)

const seedCurrencies = async () => {
    try {
        const obj = CurrencyList.getAll('en_US')
        const currencies = Object.values(obj).map((v) => ({
            name: v.name,
            code: v.code,
            symbol: v.symbol,
        }))

        const data = await Currency.insertMany(currencies)

        console.log(`Inserted ${data.length} currencies`)
    } catch (e) {
        console.error('Error seeding currencies', e)
    }
}

const seedCountries = async () => {
    try {
        const data = await Country.insertMany(
            getData().map((c) => ({ name: c.name, iso_2: c.code }))
        )

        console.log(`Inserted ${data.length} countries`)
    } catch (e) {
        console.error('Error seeding countries', e)
    }
}

const seedRegions = async () => {
    try {
        const regions = seedData[env].regions

        if (!regions.length) throw new Error('No regions data')

        const currencies = await Currency.find({
            code: { $in: regions.map((i) => i.code) },
        })

        const formatedRegions = regions
            .map((r) => ({
                ...r,
                currency: String(
                    currencies.find((c) => c.code === r.code)?._id
                ),
            }))
            .filter((r) => r.currency !== 'undefined') // Becuase String(undefied) = 'undefined'

        const data = await Region.insertMany(formatedRegions)

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
                password: process.env.SEED_PW,
            }))
            .filter((u) => u.region !== 'undefined')

        const data = await User.insertMany(formatedUsers)

        console.log(`Inserted ${data.length} users`)
    } catch (e) {
        console.error('Error seeding users', e)
    }
}

const seed = async () => {
    try {
        await seedCurrencies()
        await seedCountries()
        await seedRegions()
        await seedUsers()
    } catch (e) {
        console.error('Error seeding data', e)
    } finally {
        mongoose.connection.close()
    }
}

seed()
