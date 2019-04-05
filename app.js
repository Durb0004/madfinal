'use strict'

// Don't forget to use NPM to install Express and Mongoose.
//hi


const debug = require('debug')('week7')
const express = require('express')
const sanitizeMongo = require('express-mongo-sanitize')


require('./startup/database')() // IIFE

const app = express()
app.use(express.json())
app.use(sanitizeMongo())

app.use('/auth', require('./routes/auth'))

app.use('/api/ingredients', require('./routes/ingredient'))
app.use('/api/pizzas', require("./routes/pizzas"))


app.use(require('./middleware/logError'))
app.use(require('./middleware/errorHandler'))


const port = process.env.PORT || 3030
app.listen(port, () => debug(`Express is listening on port ${port} ...`))