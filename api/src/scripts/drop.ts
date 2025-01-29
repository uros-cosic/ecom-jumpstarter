import mongoose from 'mongoose'

import '../config'

mongoose.connect(process.env.MONGO_URI!)

const drop = async () => {
    try {
        await mongoose.connection.dropDatabase()
        console.log('Database dropped')
    } catch (e) {
        console.error('Error droping database', e)
    } finally {
        await mongoose.connection.close()
    }
}

drop()
