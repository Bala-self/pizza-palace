
const mongoose = require('mongoose');

//--------------------------pizza schema data structure 

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Pizza name is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Pizza description is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Pizza price is required"],
    min: 0
  },
  category: {
    type: String,
    required: [true, "Pizza category is required"],
    enum: {
      values: ["Veg", "Non-Veg", "Specialty"],
      message: "Category must be Veg, Non-Veg, or Specialty"
    }
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"]
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Pizza", pizzaSchema);

