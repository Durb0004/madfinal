const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const User = require("../../models/User")
const sanitizeBody = require("../../middleware/sanitizeBody")
const authorize = require('../../middleware/auth')
const AuthAttempts = require("../../models/authAttempts")
const Order = require("../../models/Orders")
const ResourceNotFoundError = require('../../exceptions/ResourceNotFound')
// Register a new user
router.post('/users', sanitizeBody, (req, res, next) => {
  new User(req.sanitizedBody)
    .save()
    .then(newUser => res.status(201).send({
      data: newUser
    }))
    .catch(next)
})


router.post('/tokens', sanitizeBody, async (req, res) => {
  const {
    email,
    password
  } = req.sanitizedBody
  const user = await User.authenticate(email, password)
  const time = new Date
  time.setHours(time.getHours() - 4);


  if (!user) {
    const authAttempts = new AuthAttempts({
      username: email,
      ipAddress: req.ip,
      didSucceed: false,
      createdAt: time


    })
    await authAttempts.save()
  } else {

    const authAttempts = new AuthAttempts({
      username: email,
      ipAddress: req.ip,
      didSucceed: true,
      createdAt: time


    })
    await authAttempts.save()
  }
  if (!user) {
    return res.status(401).send({
      errors: [{
        status: 'Unauthorized',
        code: '401',
        title: 'Incorrect username or password.'
      }]
    })
  }


  res.status(201).send({
    data: {
      token: user.generateAuthToken()
    }
  })
})
router.get('/users/me', sanitizeBody, authorize, async (req, res) => {
  const user = await User.findById(req.user._id)
  res.send({
    data: user
  })
})
router.patch('/users/me', sanitizeBody, authorize, async (req, res, next) => {
  try {

    const {
      _id,
      ...otherAttributes
    } = req.sanitizedBody

    const user = await User.findById(req.user._id)

    user.password = req.sanitizedBody.password
    await user.save()
    if (!user) throw new ResourceNotFoundError(
      `We could not find a user with id: ${req.params.id}`
    )
    res.send({
      data: user
    })
  } catch (err) {
    next(err)
  }




})



module.exports = router