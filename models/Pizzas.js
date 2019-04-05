const mongoose = require("mongoose");
const Ingredient = require("./Ingredients")

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 64
  },
  price: {
    type: Number,
    minlength: 1000,
    maxlength: 10000,
    default: 1000
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra large'],
    default: 'small'
  },
  isGlutenFree: {
    type: Boolean,
    defalut: false
  },
  imageUrl: {
    type: String,
    maxlength: 1024
  },
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ingredient"
  }],
  extraToppings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient'
  }]
});

const Model = mongoose.model("Pizza", schema);

module.exports = Model;