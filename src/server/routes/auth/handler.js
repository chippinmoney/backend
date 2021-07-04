const mongoose = require('mongoose')
const { Logger } = require('../../controllers/Logger')
const { UserController } = require('../../controllers/UserController')
const { verifyEmailFormat, isEmpty, verifyMinimumLength } = require('../../util/String')
const { RequestResponse, AuthResponse } = require('../../../config/responseCode')
const { adminList, MIN_PASSWORD_LENGTH, SIGNIN_EXPIRY_TIME } = require('../../../config/auth')

const Log = new Logger()

const userController = new UserController()

class AuthHandler {

    constructor() {
      
    }

    async getCurrentUser (req, res) {
        Log.info('get: /auth/user')
        const email = res.locals['email']

        if(email) {
            const isEmailRegistered = await userController.isUserRegistered(email)
            if (!isEmailRegistered)
                res.status(200).send({user: null})
            else {
                const isAdmin = adminList.includes(email)
                const user = await userController.getByEmail(email, {_id:0, password:0, metadata:0}, true)
                const responseBody = {user}
                if (isAdmin) responseBody.user['isAdmin'] = isAdmin
                res.status(200).send(responseBody)
            }
        } else {
            res.status(200).send({user: null})
        }
    }

    async signUpInit (req, res) {
        let { name, email, password } = req.body
        Log.info('post: /auth/signup/init')

        // check parameters
        if (
            isEmpty(name) ||
            isEmpty(email) ||
            !verifyEmailFormat(email) ||
            isEmpty(password)) {
              return res.status(400).send('INVALID PARAMS')
        }

        name = name.trim()
        email = email.trim()

        if(!verifyMinimumLength(password, MIN_PASSWORD_LENGTH))
            return res.status(400).send('INVALID PARAMS')

        if (await userController.isUserRegistered(email))
            return res.status(400).send('EMAIL_ALREADY_TAKEN')

        // send verificataion email
        const mailResponse = await userController.sendAccountVerificationEmail(name, email, password)
        Log.info(mailResponse)
        if(mailResponse.status == TaskType.FAILED)
            res.status(500).send('SERVER_ERROR')
        else
            res.status(200).send('')
    }

    async signUpConfirm (req, res) {
        const { token } = req.body
        const decodedToken = userController.getDecodedToken(token)
        if (!decodedToken.data)
            return res.status(400).send('INVALID_LINK')

        const { name, email, password } = decodedToken.data
        Log.info('post: /auth/signup/verify')

        // check parameters
        if (isEmpty(name) ||
            isEmpty(email) ||
            !verifyEmailFormat(email) ||
            isEmpty(password)
        ) {
            return res.status(400).send('INVALID_LINK')
        }

        if (!decodedToken) { // invalid token
            return res.status(403).send('INVALID_LINK')
        } else { // valid token

            // start MongoDB transaction
            const mongooseSession = await mongoose.startSession()
            mongooseSession.startTransaction()

            let userID
            try {
                // create user
                const hashedPassword = userController.hashPassword(password)
                userID = await userController.createNew(name, email, hashedPassword)

                // send confirmation email
                const mailResponse = await userController.sendAccountConfirmationEmail(name, email)
                Log.info(mailResponse)
                
                // commit all changes to database
                await mongooseSession.commitTransaction()
            } catch (transactionErr) {
                await mongooseSession.abortTransaction()
                Log.error({
                    origin: 'post: /auth/signup/verify',
                    data: {name, email, password },
                    error: transactionErr.toString()
                })
                res.status(500).send('SERVER_ERROR')
            } finally {
                mongooseSession.endSession()
            }
            
            // get accessToken
            const accessToken = userController.getAccessToken(email)

            // set AUTH cookie
            // const cookieMetadata = {
            //     maxAge: SIGNIN_EXPIRY_TIME,
            //     httpOnly: 'true',
            // }
            // res.cookie('AUTH', accessToken, cookieMetadata)
            const common = {authToken: accessToken}
            const commonStr = JSON.stringify(common)

            // send response
            res.status(200).send({email: email, common: commonStr})
        }
    }

    async signIn(req, res) {
        Log.info('post: /auth/signin')
        let {email, password} = req.body

        // check parameters
        if (isEmpty(email) ||
            isEmpty(password)
        )
            return res.status(400).send('PARAMETERS_INVALID')
        
        const hashedPassword = userController.hashPassword(password)
        if (!verifyMinimumLength(password, MIN_PASSWORD_LENGTH) ||
            !userController.verifyPassword(password, hashedPassword)
        )
            return res.status(403).send('INVALID_PASSWORD')

        email = email.trim()

        // check credentials
        const user = await userController.getByEmail(email, { hashedPassword }, true)
        if (!user)
            return res.status(403).send('INVALID_TOKEN')
        
        // get accessToken
        const accessToken = userController.getAccessToken(email)

        // set AUTH cookie
        // const cookieMetadata = {
        //     maxAge: SIGNIN_EXPIRY_TIME,
        //     httpOnly: 'true',
        // }
        // res.cookie('AUTH', accessToken, cookieMetadata)
        const common = {authToken: accessToken}
        const commonStr = JSON.stringify(common)

        const isAdmin = adminList.includes(email)
        const responseBody = {
            email,
            common: commonStr
        }
        if (isAdmin)
            responseBody['isAdmin'] = isAdmin

        // send response
        res.status(200).send(responseBody)
    }

    signOut(req, res) {
        Log.info('post: /auth/signout')
        // remove access token from cookies
        // res.clearCookie('AUTH')
        const common = {authToken: 'clear'}
        const commonStr = JSON.stringify(common)

        // send response
        res.status(200).send({common: commonStr})
    }

    async resetPasswordInit(req, res) {
        Log.info('post: /auth/resetpassword/init')
        const { username } = req.body

        // params check
        if (isEmpty(username))
            res.status(400).send('INVALID_PARAMS')
        
        // verify username
        const user = await userController.getByEmail(username, {_id:0, metadata:0, password:0}, true)
        if(!user)
            res.status(403).send('')
        
        // send password reset link
        try {
            const mailResponse = await userController.sendResetPassowrdVerificationEmail(user.name, user.email)
            Log.info(mailResponse)
            
            res.status(200).send('')
        } catch (mailErr) {
            Log.error({
                origin: 'post: /auth/resetpassword/init',
                data: {username},
                error: mailErr
            })
            res.status(500).send('SERVER_ERROR')
        }
    }

    async resetPassword(req, res) {
        Log.info('post: /auth/resetpassword/verify')
        const { token, password } = req.body
        const decodedToken = userController.getDecodedToken(token)
        const { name, email } = decodedToken

        // check parameters
        if (isEmpty(token) ||
            isEmpty(password)   
        ) {
            res.status(400).send('')
        }

        if(!verifyMinimumLength(password, MIN_PASSWORD_LENGTH))
            return res.status(400).send('')

        if(!decodedToken.data) { // invalid token
            return res.status(403).send('')
        } else { // valid token
            
            // start MongoDB transaction
            const mongooseSession = await mongoose.startSession()
            mongooseSession.startTransaction()

            let userID
            try {
                // update password
                const hashedPassword = userController.hashPassword(password)
                userID = await userController.updateOneByEmail(email, {hashedPassword})

                // send confirmation email
                const mailResponse = await userController.sendResetPasswordConfirmationEmail(name, email)
                Log.info(mailResponse)

                // commit all changes to database
                await mongooseSession.commitTransaction()

                res.status(200).send({email: email})
            } catch (transactionErr) {
                await mongooseSession.abortTransaction()
                Log.error({
                    origin: 'post: /auth/resetpassword/verify',
                    data: {name, email},
                    error: transactionErr.toString()
                })
                res.status(500).send({})
            } finally {
                mongooseSession.endSession()
            }
        }
    }

    async isUserLoggedIn(req, res) {
        const email = res.locals['email']
        const status = await userController.isUserRegistered(email)
        return res.status(200).send({status})
    }
}

module.exports = {
    AuthHandler
}