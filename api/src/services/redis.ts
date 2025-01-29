import { createClient, SetOptions } from 'redis'

const redisClient = createClient({
    url: process.env.REDIS_URI!,
})

redisClient.connect()

redisClient.on('error', (err) => {
    console.error('Redis error', err)
})

export const getCachedValue = async (key: string) => {
    try {
        const data = await redisClient.get(key)

        if (!data) return null

        return data
    } catch {
        return null
    }
}

export const setCachedValue = async (
    key: string,
    value: any,
    ttlInSeconds?: number
) => {
    try {
        const options: SetOptions = {}

        if (ttlInSeconds) options.EX = ttlInSeconds

        await redisClient.set(key, value, options)

        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export const deleteCachedValueByKey = async (key: string) => {
    try {
        await redisClient.del(key)

        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export const deleteCachedValuesByKeyPrefix = async (prefix: string) => {
    try {
        const keys = await redisClient.keys(`${prefix}*`)

        if (keys.length) await redisClient.del(keys)

        return true
    } catch (error) {
        console.error(error)
        return false
    }
}

export default redisClient
