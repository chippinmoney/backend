const { sendRequest } = require("./util")

class RapydClient {
  constructor(config) {
    this.config = config
  }

  getCountries() {
    const url = '/v1/data/countries'

    return new Promise(resolve => {
      sendRequest(this.config, 'get', url, {}, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }

  createWallet(first_name, last_name) {
    const uniqueNum1 = `${Date.now()}`
    const uniqueNum2 = `${Date.now()}`
    const phoneNum1 = `+1812${uniqueNum1%100}307${uniqueNum2%100}`
    const phoneNum2 = `+1812${uniqueNum2%100}317${uniqueNum1%100}`
    const phoneNum3 = `181${uniqueNum2%100}2315${uniqueNum1%100}`
    const email1 = `shikhar.vaish${uniqueNum1%100}${uniqueNum2%100}@gmail.com`
    const identificationNum1 = `942${uniqueNum1%100}116${uniqueNum2%100}`
    const identificationNum2 = `942${uniqueNum2%100}126${uniqueNum1%100}`

    const body = {
      first_name,
      last_name,
      "ewallet_reference_id": `Shikhar-${uniqueNum1%1000}-${uniqueNum2%1000}`,
      "metadata": {
          "merchant_defined": true
      },
      "type": "company",
      "contact": {
          "phone_number": phoneNum1,
           email: email1,
          "first_name": "Shikhar",
          "last_name": "Vaish",
          "mothers_name": "Jane Smith",
          "contact_type": "business",
          "address": {
              "name": "Shikhar Vaish",
              "line_1": "123 Main Street",
              "line_2": "",
              "line_3": "",
              "city": "Anytown",
              "state": "NY",
              "country": "US",
              "zip": "12345",
              "phone_number": phoneNum2,
              "metadata": {
                  "merchant_defined": true
              },
              "canton": "",
              "district": ""
          },
          "identification_type": "PA",
          "identification_number": identificationNum1,
          "date_of_birth": "11/22/2000",
          "country": "US",
          "metadata": {
              "merchant_defined": true
          },
          "business_details": {
              "entity_type": "association",
              "name": "Four Star Professional Services",
              "registration_number": identificationNum2,
              "industry_category": "company",
              "industry_sub_category": "home services",
              "address": {
                  "name": "John Doe",
                  "line_1": "1234 Main Street",
                  "line_2": "Suite 1200",
                  "line_3": "",
                  "city": "Anytown",
                  "state": "NY",
                  "country": "US",
                  "zip": "10101",
                  "phone_number": phoneNum3,
                  "metadata": {
                      "merchant_defined": true
                  }
              }
          }
      }
    }

    const url = '/v1/user'

    return new Promise(resolve => {
      sendRequest(this.config, 'post', url, body, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
    
  }

  getWallet(ewalletId) {
    const url = `/v1/user/${ewalletId}`
    return new Promise(resolve => {
      sendRequest(this.config, 'get', url, {}, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }

  deleteWallet(walletId) {
    const url = `/v1/user/${walletId}`
    return new Promise(resolve => {
      sendRequest(this.config, 'delete', url, {}, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }

  addWalletContact(walletId, first_name, last_name, email) {
    const uniqueNum1 = `${Date.now()}`
    const uniqueNum2 = `${Date.now()}`
    const phoneNum1 = `+1812${uniqueNum1%100}307${uniqueNum2%100}`
    const phoneNum2 = `+1812${uniqueNum2%100}317${uniqueNum1%100}`
    const identificationNum1 = `942${uniqueNum1%100}116${uniqueNum2%100}`

    const body = {
      "first_name": first_name,
      "last_name": last_name,
      "middle_name": "",
      "second_last_name": "",
      "mothers_name": "Joe Doe",
      "gender": "male",
      "marital_status": "single",
      "house_type": "lease",
      "contact_type": "personal",
      "phone_number": phoneNum1,
      "email": email,
      "identification_type": "PA",
      "identification_number": identificationNum1,
      "date_of_birth": "11/22/2000",
      "country": "US",
      "nationality": "FR",
      "address": {
          "name": "Jane Doe",
          "line_1": "123 Lake Forest Drive",
          "line_2": "",
          "line_3": "",
          "city": "Anytown",
          "state": "NY",
          "zip": "12345",
          "phone_number": phoneNum2,
          "metadata": {
              "merchant_defined": true
          },
          "canton": "",
          "district": ""
      },
      "metadata": {
          "merchant_defined": true
      }
    }

    const url = `/v1/ewallets/${walletId}/contacts`
    return new Promise(resolve => {
      sendRequest(this.config, 'post', url, body, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }

  getWalletContact(walletId, contactId) {
    const url = `/v1/ewallets/${walletId}/contacts/${contactId}`

    return new Promise(resolve => {
      sendRequest(this.config, 'get', url, {}, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })

  }

  deleteWalletContact(walletId, contactId) {
    const url = `/v1/ewallets/${walletId}/contacts/${contactId}`

    return new Promise(resolve => {
      sendRequest(this.config, 'delete', url, {}, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }

  issueCard(contactId) {
    const body = {
      ewallet_contact: contactId,
      country: 'US'
    }
    const url = `/v1/issuing/cards`

    return new Promise(resolve => {
      sendRequest(this.config, 'post', url, body, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }

  getIssuedCards(contactId, pageNumber, pageSize) {
    const url = `/v1/issuing/cards?contact=${contactId}&page_number=${pageNumber}&page_size=${pageSize}`

    return new Promise(resolve => {
      sendRequest(this.config, 'get', url, {}, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }

  createCheckoutPage(amount, walletId) {
    const body = {
      "amount": amount,
      "complete_payment_url": "http://example.com/complete",
      "country": "SG",
      "currency": "SGD",
      "error_payment_url": "http://example.com/error",
      "cardholder_preferred_currency": true,
      "language": "en",
      "metadata": {
          "merchant_defined": true
      },
      "expiration": 1623115536,
      "ewallet": walletId,
      "payment_method_type_categories": ['ewallet'],
    }

    const url = `/v1/checkout`
    return new Promise(resolve => {
      sendRequest(this.config, 'post', url, body, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }

  transferFromToWallet(amount, sourceWalletId, destinationWalletId) {
    const body = {
      amount,
      currency: 'USD',
      source_wallet: sourceWalletId,
      destination_wallet: destinationWalletId
    }

    const url = `/v1/account/transfer`
    return new Promise(resolve => {
      sendRequest(this.config, 'post', url, body, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }

  getWalletTransactions(walletId, pageNumber, pageSize) {
    const url = `/v1/user/${walletId}/transactions?page_number=${pageNumber}&page_size=${pageSize}`
    return new Promise(resolve => {
      sendRequest(this.config, 'get', url, {}, (statusCode, result) => {
        resolve({statusCode, result})
      })
    })
  }
}

module.exports = {
  RapydClient
}