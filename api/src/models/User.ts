import { model, Model, ObjectId, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

import { IBaseModel } from '../lib/types'
import eventBus from '../services/event-bus'
import { UserService } from '../services/user'

export interface IUser extends IBaseModel {
    name: string
    email: string
    password: string
    role: USER_ROLE
    cart: ObjectId
    region: ObjectId
    passwordChangedAt?: Date | null
    resetPasswordToken?: string | null
    resetPasswordExpires?: Date | null
    active: boolean
}

export enum USER_ROLE {
    ADMIN = 'admin',
    USER = 'user',
}

interface IUserMethods {
    correctPassword(candidatePw: string, userPw: string): Promise<boolean>
    changedPasswordAfter(jwtTimestamp: number): boolean
}

type UserModel = Model<IUser, {}, IUserMethods>

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 255,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: (val: string) => {
                    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        String(val)
                    )
                },
                message: 'Invalid email',
            },
        },

        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },

        role: {
            type: String,
            required: true,
            default: USER_ROLE.USER,
            enum: {
                values: [USER_ROLE.ADMIN, USER_ROLE.USER],
                message: '{VALUE} is not supported role value',
            },
        },

        cart: {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
        },

        region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },

        passwordChangedAt: Date,
        resetPasswordToken: String,
        resetPasswordExpires: Date,

        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

UserSchema.set('toObject', {
    versionKey: false,
    transform: function (_doc, rec) {
        delete rec.password
    },
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)

    next()
})

UserSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = new Date(Date.now() - 1000)

    next()
})

UserSchema.pre('save', function (next) {
    if (this.isNew) eventBus.emit(UserService.Events.CREATED, this.toObject())
    next()
})

UserSchema.method(
    'correctPassword',
    async function (candidatePw: string, userPw: string) {
        return await bcrypt.compare(candidatePw, userPw)
    }
)

UserSchema.method('changedPasswordAfter', function (jwttimestamp: number) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            String(this.passwordChangedAt.getTime() / 1000),
            10
        )
        return jwttimestamp < changedTimestamp
    }
    return false
})

export default model<IUser, UserModel>('User', UserSchema)
