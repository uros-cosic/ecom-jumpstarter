import { Query } from 'mongoose'

export class APIFeatures {
    query
    queryString

    constructor(
        query: Query<any[], any, {}, any, 'find', {}>,
        queryString: Record<string, any>
    ) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const queryObj = { ...this.queryString }
        const excludeFields = ['page', 'sort', 'limit', 'fields']

        excludeFields.forEach((el) => delete queryObj[el])

        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt|eq)\b/g,
            (match) => `$${match}`
        )

        this.query = this.query.find(JSON.parse(queryString))
        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 10
        const skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit)

        return this
    }
}
