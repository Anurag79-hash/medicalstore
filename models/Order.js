const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine",
    required: true
  },

  price: Number,
  discount: Number,
  finalPrice: Number,
  
  address: { type: String, required: true },

  // GPS Location
  latitude: { type: Number },
  longitude: { type: Number },

  status: {
    type: String,
    default: "Pending"
  },

  adminProcessed: { type: Boolean, default: false },
  userReceived: { type: Boolean, default: false },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", OrderSchema);
