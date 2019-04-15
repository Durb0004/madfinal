const mongoose = require('mongoose')
const User = require('./User')
const Pizza = require('./Pizzas')
const Ingredient = require("./Ingredients")


const schema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  type: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup'
  },
  status: {
    type: String,
    enum: ['draft', 'ordered', 'paid', 'delivered'],
    default: 'draft'
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

schema.pre('save', async function () {
  await this.populate('pizza').execPopulate();

  this.price = this.pizza.reduce((acc, element) => acc += element.price, 0)

  if (this.type == 'delivery') {
    this.deliveryCharge = 500
    this.address = true
    this.tax = (this.price + this.deliveryCharge) * 0.13;
    this.total = this.price + this.tax + this.deliveryCharge;
  } else {
    this.address = false;
    this.tax = (this.price) * 0.13;
    this.total = this.price + this.tax;
  }


})




const Model = mongoose.model('Order', schema)

module.exports = Model