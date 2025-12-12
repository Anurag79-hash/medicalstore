const Medicine = require("../models/Medicine");
const moment = require("moment");
const Order = require("../models/Order");
exports.addMedicine = async (req, res) => {
    const { name, brand, price, stock, expiryDate } = req.body;

    const newMed = new Medicine({
        name,
        brand,
        price,
        stock,
        expiryDate,
        image: req.file ? req.file.filename : null
    });

    await newMed.save();
    res.redirect("/admin/dashboard");
};

exports.getMedicines = async (req, res) => {
    const medicines = await Medicine.find({ isExpired: false });
    res.render("user/home", { medicines });
};

exports.checkExpiry = async () => {
    const meds = await Medicine.find();
    meds.forEach(async (m) => {
        if (moment(m.expDate).isBefore(moment())) {
            m.isExpired = true;
            await m.save();
        }
    });
};


exports.buyMedicine = async (req, res) => {
   
        console.log("hello from by");
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).send("Medicine Not Found");

    res.render("user/orderDetails", { medicine });
  } catch (error) {
    console.log(error);
  }
};
exports.placeOrder = async (req, res) => {
  try {
    const { medicineId, quantity, address, latitude, longitude } = req.body;

    const userId = req.session.user.id;
    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).send("Medicine not found");
    }

    let discount = medicine.discount || 0;
    let finalPrice = medicine.price*quantity - (medicine.price*quantity * discount / 100);

    await Order.create({
      userId,
      medicineId,
      price: medicine.price,
      discount,
      finalPrice,
      address,
      latitude: latitude || null,
      longitude: longitude || null,
      status: "Pending"
    });

res.redirect("../dashboard/?success=Ordered Successfully")

    // res.redirect("/orders/success");   // <-- You can replace with any success page
  } catch (err) {
    console.log(err);
    res.status(500).send("Error placing order");
  }
};







