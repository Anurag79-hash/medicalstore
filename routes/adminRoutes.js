const express = require("express");
const router = express.Router();
// const adminAuth = require("../middleware/adminAuth");
const { adminAuth, isLoggedIn, noCache } = require("../middleware/authMiddleware");

// Usage:


// const upload = require("../middleware/multer");
const upload = require("../middleware/multerCloud");
const adminController = require("../controllers/adminController");
// const noCache = require("../middleware/noCache");


router.get("/dashboard", adminAuth, noCache, adminController.adminDashboard);
router.post("/order/complete/:id", adminAuth,noCache, adminController.updateOrderStatus);

router.get("/users", adminAuth,noCache, adminController.listUsers);

// ---------- Medicines ----------
router.get("/medicines", adminAuth,noCache, adminController.listMedicines);
router.get("/stock/add", adminAuth,noCache, adminController.getAddMedicine);
console.log("from routes");
router.post(
  "/stock/add",
  adminAuth,
  upload.single("image"),
  adminController.postAddMedicine
);






router.get("/editMedicine/:id",noCache, adminAuth, adminController.getEditMedicine);
router.post("/editMedicine/:id",noCache, adminAuth, upload.single("image"), adminController.postEditMedicine);

router.post("/deleteMedicine/:id", adminAuth, adminController.deleteMedicine);

module.exports = router;
