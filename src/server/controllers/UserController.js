const { User } = require('../models/User')
const { JWT_SECRET, ACCOUNT_VERIFICATION_EXPIRY_TIME, ACCOUNT_VERIFICATION_EMAIL, ACCOUNT_CONFIRMATION_EMAIL, SIGNIN_EXPIRY_TIME, RESET_PASSWORD_VERIFICATION_EMAIL, RESET_PASSWORD_CONFIRMATION_EMAIL } = require('../../config/auth')
const { EmailService } = require('../services/EmailService')
const { Logger } = require('./Logger')

const Log = new Logger()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const mailer = new EmailService()

class UserController {

    constructor() {
    }
    
    async isUserRegistered(email) {
        return 1 == ( await User.countDocuments({ email }) )
    }

    hashPassword(password) {
        return bcrypt.hashSync(password)
    }

    verifyPassword(rawPassword, passwordHash) {
        return bcrypt.compareSync(rawPassword, passwordHash)
    }

    async createNew(name, email, password) {
        const user = await User.create({ name, email, password, metadata: { createdAt: Date.now() } })
        return user._id
    }

    async getByID(ID, fields, isLean=false) {
        return await User.findOne({ ID }, { ...fields }).lean(isLean)
    }

    async getByEmail(email, fields, isLean=false) {
        return await User.findOne({ email }, { ...fields }).lean(isLean)
    }

    async updateOneByUserID(userID, fields) {
        await User.updateOne({ _id: userID }, { ...fields })
    }

    async updateOneByEmail(email, userUpdates) {
        await User.updateOne({ email }, userUpdates)
    }

    async deleteOne(userID, fields) {
        await User.deleteOne({ _id: userID }, { ...fields })
    }

    getDecodedToken(token) {
        try {
            const decodedData = jwt.verify(token, JWT_SECRET)
            return decodedData
        } catch(jwtErr) {
            return {}
        }
    }

    getAccessToken(email) {
        const payload = {
            email: email,
        }

        return jwt.sign({
            exp: Date.now() + SIGNIN_EXPIRY_TIME,
            data: { ...payload }
        }, JWT_SECRET)
    }

    async sendAccountVerificationEmail(name, email, password) {
        // generate token
        const payload = {
            name: name,
            email: email,
            password: this.hashPassword(password)
        }
        const token = jwt.sign({
            exp: Date.now() + ACCOUNT_VERIFICATION_EXPIRY_TIME,
            data: { ...payload },
        }, JWT_SECRET)

        // send verification email
        try {
            const mailResponse = await mailer.sendMail(
                email,
                ACCOUNT_VERIFICATION_EMAIL.subject,
                ACCOUNT_VERIFICATION_EMAIL.body(name, token)
            )
            mailResponse.message = `sendAccountVerificationEmail: sent to ${email}`
            Log.info(mailResponse)

            return mailResponse
        } catch(mailErr) {
            mailErr.message = `sendAccountVerificationEmail: could not send to ${email}`
            Log.error(mailErr)
            return mailErr
        }
    }

    async sendAccountConfirmationEmail(name, email) {
        try {
            const mailResponse = await mailer.sendMail(
                email,
                ACCOUNT_CONFIRMATION_EMAIL.subject,
                ACCOUNT_CONFIRMATION_EMAIL.body(name)
            )
            mailResponse.message = `sendAccountConfirmationEmail: sent to ${email}`
            Log.info(mailResponse)

            return mailResponse
        } catch(mailErr) {
            mailErr.message = `sendAccountConfirmationEmail: could not send to ${email}`
            Log.error(mailErr)
            return mailErr
        }
    }

    async sendResetPassowrdVerificationEmail(name, email) {
        // generate token
        const payload = { 
            name: name,
            email: email
        }
        const token = jwt.sign({
            exp: Date.now() + ACCOUNT_VERIFICATION_EXPIRY_TIME,
            data: { ...payload }
        }, JWT_SECRET)

        // send reset link
        try {
            const mailResponse = await mailer.sendMail(
                email,
                RESET_PASSWORD_VERIFICATION_EMAIL.subject,
                RESET_PASSWORD_VERIFICATION_EMAIL.body(name, token)
            )
            mailResponse.message = `sendResetPassowrdVerificationEmail: sent to ${email}`
            Log.info(mailResponse)

            return mailResponse
        } catch(mailErr) {
            mailErr.message = `sendResetPassowrdVerificationEmail: could not send to ${email}`
            Log.error(mailErr)
            return mailErr
        }
    }

    async sendResetPasswordConfirmationEmail(name, email) {
        try {
            const mailResponse = await mailer.sendMail(
                email,
                RESET_PASSWORD_CONFIRMATION_EMAIL.subject,
                RESET_PASSWORD_CONFIRMATION_EMAIL.body(name)
            )
            mailResponse.message = `sendResetPasswordConfirmationEmail: sent to ${email}`
            Log.info(mailResponse)

            return mailResponse
        } catch(mailErr) {
            mailErr.message = `sendResetPasswordConfirmationEmail: could not send to ${email}`
            Log.error(mailErr)
            return mailErr
        }
    }
}

module.exports = { 
    UserController 
}