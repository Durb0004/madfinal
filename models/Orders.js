const mongoose = require('mongoose')
const User = require('./User')

const schema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  type: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: "pickup"
  },
  status: {
    type: String,
    enum: ['draft', 'ordered', 'paid', 'delivered'],
    default: "draft"
  },
  pizza: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pizza'

  }],
  address: {
    type: String,
    required: function () {
      this.type == 'delivery' ? true : false
    }
  },
  price: {
    type: Number,
    default: 0
  },
  deliveryCharge: {
    type: Number,
    default: function () {
      this.type == 'delivery' ? 500 : 0
    }
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }


})



const Model = mongoose.model('Order', schema)

module.exports = Model