const { RapydClient } = require("../../../rapyd/client");
const { RAPYD_API } = require("../../../config/rapyd");

const config = {
  secret_key: RAPYD_API.secret_key,
  access_key: RAPYD_API.access_key
}

const rapydClient = new RapydClient(config)

class CardHandler {

  async issueCard(req, res) {
    console.log('post: /card')
    const {contactId} = req.query

    const apiResponse = await rapydClient.issueCard(contactId)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }

  async getIssuedCards(req, res) {
    console.log('get: /wallet/contact')
    const {contactId, pageNumber, pageSize} = req.query

    const apiResponse = await rapydClient.getIssuedCards(contactId, pageNumber, pageSize)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }

  async createCheckoutPage(req, res) {
    console.log('post: /checkout/')
    const {amount, walletId} = req.body

    const apiResponse = await rapydClient.getIssuedCards(amount, walletId)
    res.status(apiResponse.statusCode).send(apiResponse.result)
  }
}

module.exports = {
  CardHandler
}