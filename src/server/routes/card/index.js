const CardHandler = require('./handler').CardHandler;
const express = require('express')
const cardRouter = express.Router()

const cardHandler = new CardHandler()

// issue card
cardRouter.post('/', cardHandler.issueCard)

// get issued cards
cardRouter.get('/', cardHandler.getIssuedCards)

// create checkout page
cardRouter.post('/checkout', cardHandler.createCheckoutPage)

module.exports = {
  cardRouter
}