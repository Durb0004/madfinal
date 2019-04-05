const debug = require('debug')('week7:db')
const mongoose = require('mongoose')

module.exports = () => {
  mongoose
    .connect(`mongodb://localhost:27017/MADFINAL`, {
      useNewUrlParser: true
    })
    .then(() => {
      debug(`Connected to MongoDB ...`)
    })
    .catch(err => {
      debug(`Error connecting to MongoDB ...`, err)
      process.exit(1)
    })
}