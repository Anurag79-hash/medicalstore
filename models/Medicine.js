const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
    name: String,
    brand: String,
    price: Number,
    discount:Number,
    stock: Number,
    mfgDate:Date,
    category:String,
    form:String,
    expDate: Date,
    image: String,  // <-- Medicine Image Path
    isExpired: { type: Boolean, default: false },
    createdAt:{type:Date, default:Date.now }
});

module.exports = mongoose.model("Medicine", MedicineSchema);
