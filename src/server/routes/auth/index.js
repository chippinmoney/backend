const { AuthHandler } = require('./handler')
const { Router } = require('express')
const { verifySignedIn, verifySignedOut } = require('../../middleware/AuthGuard')
const { getEmailIfExists } = require('../../middleware/Util')

const authRouter = Router()
const authHandler = new AuthHandler()

// Signup
authRouter.post(
    '/signup/init',
    [verifySignedOut],
    authHandler.signUpInit
)
authRouter.post(
    '/signup/verify',
    [verifySignedOut],
    authHandler.signUpConfirm
)

// Signin
authRouter.post(
    '/signin',
    [verifySignedOut],
    authHandler.signIn
)
authRouter.post(
    '/signout',
    [verifySignedIn],
    authHandler.signOut
)

// Reset Password
authRouter.post(
    '/resetpassword/init',
    authHandler.resetPasswordInit
)
authRouter.post(
    '/resetpassword/verify',
    authHandler.resetPassword
)

// Get current user
authRouter.get(
    '/user',
    [getEmailIfExists],
    authHandler.getCurrentUser
)

module.exports = {
    authRouter
}