const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoService = require('./services/MongoService').MongoService

const router = require('./routes/index').router

const PORT = 3500;

const run_server = (PORT) => {
  // initialise server
  const app = express()

  // middlewares 
  app.use(bodyParser.urlencoded({ extended: false })) // accept json payload
  app.use(bodyParser.json()) // accept json payload
  app.use(cors({
      credentials: true, 
      origin: [
          'http://localhost',
          'http://127.0.0.1',
      ]
  })); // allow CORS

  app.use('/', router);

  const mongoService = new MongoService()

  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
    const mongoURL = 'mongodb://localhost:27017/chipin'
    mongoService.startConnection(mongoURL) // mongoDB connection

  })
}

run_server(PORT);



