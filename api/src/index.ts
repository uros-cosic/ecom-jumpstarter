import express, {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from 'express'
import path from 'path'
import mongoose from 'mongoose'
import cors from 'cors'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'
import i18next from 'i18next'
import i18nextHttpMiddleware from 'i18next-http-middleware'
import i18nextFsBackend from 'i18next-fs-backend'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

import { AppError } from './lib/app-error'
import globalErrorHandler from './controllers/error-controller'
import apiRoute from './routes/api-route'
import './config'
import './subscribers'
import './jobs'
import './websocket'
import './services/redis'

i18next
    .use(i18nextFsBackend)
    .use(i18nextHttpMiddleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        backend: {
            loadPath: path.join(
                process.cwd(),
                'storage',
                'locales',
                '{{lng}}',
                'translation.json'
            ),
        },
        detection: {
            order: ['querystring', 'header', 'cookie'],
            caches: ['cookie'],
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupHeader: 'accept-language',
        },
    })

const app = express()
const PORT = process.env.PORT || 5000

const STORE_CORS = process.env.STORE_CORS?.split(',') ?? []
const ADMIN_CORS = process.env.ADMIN_CORS?.split(',') ?? []

const storeCorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || STORE_CORS.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(i18next.t('errors.cors-message')))
        }
    },
    methods: ['GET', 'PATCH', 'POST'],
    credentials: true,
}

const adminCorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || ADMIN_CORS.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(i18next.t('errors.cors-message')))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
}

mongoose
    .connect(process.env.MONGO_URI!)
    .then(() => console.log('DB Connected'))
    .catch((e) => console.error(e))

app.use(i18nextHttpMiddleware.handle(i18next))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

app.use(cors(storeCorsOptions))
app.use('/api/admin', cors(adminCorsOptions))

app.use(cookieParser())
app.use(hpp({ whitelist: [] }))

app.use(express.static(path.join(process.cwd(), 'public')))

if (process.env.NODE_ENV === 'development') {
    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(YAML.load(path.join(process.cwd(), 'swagger.yaml')))
    )
}

app.use('/api', apiRoute)

app.route('*').all((req: Request, _res: Response, next: NextFunction) => {
    next(
        new AppError(
            `${req.t('errors.cant-find-route', {
                route: req.originalUrl,
            })}`,
            404
        )
    )
})

app.use(
    (
        err: ErrorRequestHandler,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        globalErrorHandler(err, req, res, next)
    }
)

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

process.on('uncaughtException', async (err: any) => {
    console.log('UNCAUGHT EXCEPTION - SHUTTING DOWN')
    console.error(err)

    server.close(() => {
        process.exit(1)
    })
})

process.on('unhandledRejection', async (err: any) => {
    console.log('UNHANDLED REJECTION - SHUTTING DOWN')
    console.error(err)

    server.close(() => {
        process.exit(1)
    })
})

export { app, server }
