const { JWT_SECRET } = require('../../config/auth')
const jwt = require('jsonwebtoken')
const { Logger } = require('../controllers/Logger')

const Log = new Logger()

const getDecodedToken = (token) => {
    return new Promise(resolve => {
        jwt.verify(token, JWT_SECRET, (err, decodedData) => {
            if(err) {
                resolve({})
            }
            else
                resolve(decodedData)
        })
    })
}

const verifySignedIn = async (req, res, next) => {
    const { common } = req.query
    let isSignedIn = true
    let decoded

    if (common && common!='undefined' && common!='null' && common!='clear') {
        const commonOb = JSON.parse(common)
        const token = commonOb.authToken
    
        decoded = await getDecodedToken(token)
        
        if (!token || !decoded || !decoded.data || !decoded.data['email']) { // invalid token
            isSignedIn = false
        }
    } else {
        isSignedIn = false
    }

    if(isSignedIn) {
        res.locals.email = decoded.data['email']
        next()
    } else {
        const errorResponse = 'UNAUTHORIZED'
        return next(errorResponse)
    }
}

const verifySignedOut = async (req, res, next) => {
    const { common } = req.query
    let isSignedIn = true

    if (common && common!='undefined' && common!='null' && common!='clear') {
        const commonOb = JSON.parse(common)
        const token = commonOb.authToken
    
        const decoded = await getDecodedToken(token)
    
        
        if (!token || !decoded || !decoded.data || !decoded.data['email']) { // invalid token
            isSignedIn = false
        }
    } else {
        isSignedIn = false
    }

    if(isSignedIn) {
        const errorResponse = 'UNAUTHORIZED'
        return next(errorResponse)
    } else {
        next()
    }
}

module.exports = {
    verifySignedIn,
    verifySignedOut
}