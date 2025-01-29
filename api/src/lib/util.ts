import path from 'path'

export const filterObj = (obj: any, ...allowedFields: Array<string>) => {
    const newObj: any = {}
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}

export const generateUniqueFileName = (file: any) => {
    const uniqueSuffix = String(Math.round(Math.random() * 1e9))
    const fileName =
        path.parse(file.originalname).name +
        '-' +
        uniqueSuffix +
        path.extname(file.originalname)
    return fileName
}

export const generateRandomString = (length: number = 5): string => {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let result = ''

    const charactersLength = characters.length

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}

export const formatDate = (date: Date | string, locale: string): string => {
    return new Date(date).toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export const formatCurrency = (
    locale: string,
    currency: string,
    amount: number
) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount)
}

export const calculateMillisecondsToDate = (targetDate: string | Date) => {
    const target = new Date(targetDate)

    const now = Date.now()

    const millisecondsToTarget = target.getTime() - now

    return millisecondsToTarget
}
