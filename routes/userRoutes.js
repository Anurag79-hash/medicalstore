const express = require("express");
const router = express.Router();

const noCache = require("../middleware/noCache");
const auth = require("../middleware/authMiddleware");
const controllers = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const medicineController = require("../controllers/medicineController");

router.get("/dashboard", auth.isLoggedIn, controllers.userDashboard);

// Home page
router.get("/", noCache, homeController.homePage);

// Register
router.get('/register', (req, res) => {
    res.render("user/register", { title: "Register Page" });
});
router.get('/editprofile',auth.isLoggedIn,(req,res)=>{
    res.render("user/editprofile");
})
router.post('/editprofile',auth.isLoggedIn,controllers.editProfile);
// Login (fixed)
router.get('/login', noCache, (req, res) => {
    res.render("user/login");
});

// Register & login
router.post("/register", noCache, controllers.registerUser);
router.post("/login", noCache, controllers.loginUser);

// Logout
router.get("/logout", controllers.logoutUser);

// Buy medicine
router.get("/buy/:id", auth.isLoggedIn, medicineController.buyMedicine);
router.post("/order/confirm", auth.isLoggedIn, medicineController.placeOrder);

module.exports = router;
