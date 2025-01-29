import { AppError } from '../app-error'

describe('AppError', () => {
    test('Constructs correct fail error', () => {
        const errMessage = 'test-error'
        const errStatusCode = 456
        const err = new AppError(errMessage, errStatusCode)

        expect(err.message).toBe(errMessage)
        expect(err.statusCode).toBe(errStatusCode)
        expect(err.isOperational).toBe(true)
    })

    test('Constructs correct default error', () => {
        const errMessage = 'test-err'
        const err = new AppError(errMessage)

        expect(err.message).toBe(errMessage)
        expect(err.statusCode).toBe(500) // default
        expect(err.isOperational).toBe(true)
    })
})
