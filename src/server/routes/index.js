require('dotenv').config()
const express = require('express')
const authRouter = require('./auth').authRouter
const groupRouter = require('./group').groupRouter
const walletRouter = require('./wallet').walletRouter
const cardRouter = require('./card').cardRouter

const router = express.Router()

router.use('/auth', authRouter)
router.use('/group', groupRouter)
router.use('/wallet', walletRouter)
router.use('/card', cardRouter)

module.exports = {
  router
}
