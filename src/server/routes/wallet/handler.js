const { RapydClient } = require("../../../rapyd/client");
const { RAPYD_API } = require("../../../config/rapyd");

const config = {
  secret_key: RAPYD_API.secret_key,
  access_key: RAPYD_API.access_key
}

const rapydClient = new RapydClient(config)

class WalletHandler {

  async createWallet(req, res) {
    console.log('post: /wallet')
    const {first_name, last_name, email} = req.body

    const apiResponse = await rapydClient.createWallet(first_name, last_name)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }

  async getWallet(req, res) {
    console.log('get: /wallet')
    const {walletId} = req.query

    const apiResponse = await rapydClient.getWallet(walletId)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }

  async deleteWallet(req, res) {
    console.log('delete: /wallet')
    const {walletId}  = req.query

    const apiResponse = await rapydClient.deleteWallet(walletId)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }

  async addWalletContact(req, res) {
    console.log('post: /wallet/contact')
    const {first_name, last_name, email, walletId} = req.body

    const apiResponse = await rapydClient.addWalletContact(walletId, first_name, last_name, email)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }

  async getWalletContact(req, res) {
    console.log('get: /wallet/contact')
    const {walletId, contactId} = req.query

    const apiResponse = await rapydClient.getWalletContact(walletId, contactId)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }

  async deleteWalletContact(req, res) {
    console.log('delete: /wallet/contact')
    const {walletId, contactId} = req.query

    const apiResponse = await rapydClient.deleteWalletContact(walletId, contactId)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }

  async transferFromToWallet(req, res) {
    console.log('post: fund/wallet-wallet')
    const {amount, sourceWalletId, destinationWalletId} = req.body

    const apiResponse = await rapydClient.getIssuedCards(amount, sourceWalletId, destinationWalletId)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }

  async getWalletTransactions(req, res) {
    console.log('get: /wallet/transactions')
    const {walletId, pageNumber, pageSize} = req.query

    const apiResponse = await rapydClient.getWalletTransactions(walletId, pageNumber, pageSize)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }
}

module.exports = {
  WalletHandler
}