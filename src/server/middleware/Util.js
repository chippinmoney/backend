const { JWT_SECRET } = require('../../config/auth')
const jwt = require('jsonwebtoken')
const { Logger } = require('../controllers/Logger')

const Log = new Logger()

const getDecodedToken = (token) => {

    return new Promise(resolve => {
      jwt.verify(token, JWT_SECRET, (err, decodedData) => {
        if(err) {
          resolve({})
        } else {
          resolve(decodedData)
        }
      })
    })
}

const getEmailIfExists = async (req, res, next) => {
  // const token = req.cookies['AUTH']
  const { common } = req.query

  if (common && common!='undefined' && common!='null' && common!='clear') {
    const commonOb = JSON.parse(common)
    const token = commonOb.authToken

    const decoded = await getDecodedToken(token)
    
    if (token) {
      if (!decoded || !decoded.data || !decoded.data['email']) {} 
      else res.locals.email = decoded.data['email']
    }
  }

  next()
}

module.exports = {
  getEmailIfExists
}