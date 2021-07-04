const mongoose = require('mongoose')
const { Logger } = require('../controllers/Logger')

const Log = new Logger()

class MongoService {
    constructor() {
    }

    startConnection(hostURL) {
        mongoose.connect(hostURL, this.getDatabaseOptions())
        
        const db = mongoose.connection
        db.once('open', () => { 
            Log.info('MongoDB initialised')
        })

        db.once('error', () => { Log.error('MongoDB could not be initialised') })
    }

    getDatabaseOptions() {
        const databasesProperties = {
            useNewUrlParser: true
        }
        return {
            ...databasesProperties,
            useUnifiedTopology: true
        }
    }
}

module.exports = {
    MongoService
}