const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, "Enter id, please."],
    unique: [true, "The same id is already registered."]
  },
  make: {
    type: String,
    required: [true, "Enter make, please."],
    unique: false,
  },
  model: {
    type: String,
    required: [true, "Enter model, please."],
    unique: false,
  },
  year: {
    type: Number,
    required: [true, "Enter year, please."],
    unique: false,
  },
  colour: {
    type: String,
    required: [true, "Enter colour, please."],
    unique: false,
  },
  location_id: {
    type: Number,
    required: [true, "Enter location id, please."],
    unique: false,
  },
  location_description: {
    type: String,
    required: [true, "Enter location description, please."],
    unique: false,
  },
})

module.exports = mongoose.model.Cars || mongoose.model("Cars", CarSchema);