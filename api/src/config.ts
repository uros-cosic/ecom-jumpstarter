import dotenv from 'dotenv'

let ENV_FILE_NAME = ''

switch (process.env.NODE_ENV) {
    case 'test':
        ENV_FILE_NAME = '.env.test'
        break
    default:
        ENV_FILE_NAME = '.env'
        break
}

try {
    dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME })
} catch (error) {
    console.error(error)
}
