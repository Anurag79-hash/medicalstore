const Medicine = require("../models/Medicine");
const Order = require("../models/Order");
const User = require("../models/User");

// ---------- Admin Dashboard ----------
exports.adminDashboard = async (req, res) => {
    try {
        const meds = await Medicine.find().sort({ createdAt: -1 });
        const orders = await Order.find()
            .populate("userId")
            .populate("medicineId")
            .sort({ createdAt: -1 });

        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: "Pending" });
        const completedOrders = await Order.countDocuments({ status: "Completed" });
        const totalMedicines = await Medicine.countDocuments();
        const totalUsers = await User.countDocuments();

        res.render("admin/dashboard", {
            meds,
            orders,
            totalOrders,
            pendingOrders,
            completedOrders,
            totalMedicines,
            totalUsers
        });
    } catch (err) {
        console.log(err);
        res.send("Error loading dashboard");
    }
};

// ---------- Medicine Management ----------

// Add Medicine Form
exports.getAddMedicine = (req, res) => {
    res.render("admin/addMedicine");
};

// Add Medicine Post



// Edit Medicine Form
exports.getEditMedicine = async (req, res) => {
    try {
        const med = await Medicine.findById(req.params.id);
        if (!med) return res.send("Medicine not found");
        res.render("admin/editMedicine", { med });
    } catch (err) {
        console.log(err);
        res.redirect("admin/dashboard?error=something went wrong");
    }
};

// Edit Medicine Post
// Edit Medicine Post
// Add Medicine
exports.postAddMedicine = async (req, res) => {
    console.log("hlsdfl")
    console.log(req.file);
  try {
    const category = req.body.customCategory?.trim() || req.body.category;
    const imageUrl = req.file ? req.file.path : null;

    const newMed = new Medicine({
      name: req.body.name,
      brand: req.body.brand,
      mfgDate: req.body.mfgDate,
      expDate: req.body.expDate,
      category,
      form: req.body.form,
      price: req.body.price,
      discount: req.body.discount,
      stock: req.body.stock,
      image: imageUrl
    });

    await newMed.save();
    res.redirect("/admin/dashboard?success=Medicine Added Successfully");
  } catch (err) {
    console.log(err);
    res.send("Error adding medicine");
  }
};

// Edit Medicine
exports.postEditMedicine = async (req, res) => {
  try {
    const med = await Medicine.findById(req.params.id);
    if (!med) return res.send("Medicine not found");

    med.name = req.body.name;
    med.brand = req.body.brand;
    med.mfgDate = req.body.mfgDate;
    med.expDate = req.body.expDate;
    med.category = req.body.customCategory?.trim() || req.body.category;
    med.form = req.body.form;
    med.price = req.body.price;
    med.discount = req.body.discount;
    med.stock = req.body.stock;

    if (req.file && req.file.path) {
      med.image = req.file.path;
    }

    await med.save();
    res.redirect("/admin/dashboard?success=Medicine Updated Successfully");
  } catch (err) {
    console.log(err);
    res.send("Error updating medicine");
  }
};



// Delete Medicine
exports.deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        await Medicine.findByIdAndDelete(id);
                res.redirect("/admin/dashboard");

    } catch (err) {
        console.log(err);
        res.send("Error deleting medicine");
    }
};

// ---------- Orders Management ----------

// Mark Order Completed
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, { status: "Completed" });
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.log(err);
        res.send("Error updating order status");
    }
};

// ---------- Users Management ----------
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.render("admin/users", { users });
    } catch (err) {
        console.log(err);
        res.send("Error loading users");
    }
};

// ---------- Medicines List ----------
exports.listMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });
        res.render("admin/medicines", { medicines });
    } catch (err) {
        console.log(err);
        res.send("Error loading medicines");
    }
};
