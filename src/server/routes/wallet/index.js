const WalletHandler = require('./handler').WalletHandler;
const express = require('express')
const walletRouter = express.Router()

const walletHandler = new WalletHandler()

// create wallet
walletRouter.post('/', walletHandler.createWallet)

// get wallet
walletRouter.get('/', walletHandler.getWallet)

// delete wallet
walletRouter.delete('/', walletHandler.deleteWallet)

// add wallet contact
walletRouter.post('/contact', walletHandler.addWalletContact)

// get wallet contact
walletRouter.get('/contact', walletHandler.getWalletContact)

// delete wallet contact
walletRouter.delete('/contact', walletHandler.deleteWalletContact)

// wallet to wallet fund
walletRouter.post('/transfer', walletHandler.transferFromToWallet)

// get wallet transactions
walletRouter.get('/transactions', walletHandler.getWalletTransactions)

module.exports = {
  walletRouter
}