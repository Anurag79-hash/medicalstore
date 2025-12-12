const User=require("../models/User");
const Order = require("../models/Order");
const bcrypt=require("bcryptjs");

exports.registerUser=async (req, res)=>{
    try{
        const {name, email, password, confirmpass}=req.body;
        const userExists=await User.findOne({email});
        if(userExists) return res.send("User already exists");
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            name,
            email,
            password:hashedPassword
        });
        res.redirect("/login");
    }catch(err){
        console.log(err);
    }
}
exports.loginUser=async (req,res)=>{
    const {email, password}=req.body;
    const user =await User.findOne({email});
    if(!user) return res.send("Invalid Email");
    const isMatch= await bcrypt.compare(password,user.password);
    if(!isMatch) return res.send("Invalid Password");
    req.session.user={
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
    };
    if(user.role=="admin"){
        return res.redirect("/admin/dashboard");
    }else{
    res.redirect("/");}
};
exports.logoutUser=(req,res)=>{
    req.session.destroy();
    res.redirect("/");
}


exports.userDashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;

    // Fetch all orders of the user with medicine    
     const orders = await Order.find({ userId }).populate("medicineId");

    const pendingOrders = orders.filter(o => o.status.toLowerCase() === "pending");
    const deliveredOrders = orders.filter(o => o.status.toLowerCase() === "completed");

    res.render("user/dashboard", {
      user: req.session.user,
      pendingOrders,
      deliveredOrders,
      allOrders: orders
    });

  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};
exports.editProfile = async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect("/login"); // or show error
    }

    const userId = req.session.user.id;

    // Find current user
    const currUser = await User.findById(userId);
    if (!currUser) return res.send("User not found");

    currUser.name = req.body.name;
    currUser.email = req.body.email;

    // Update password if provided
    if (req.body.password) {
      if (req.body.password !== req.body.confirmpassword) {
        return res.redirect("/editprofile?error=Password and Confirm Password not match");
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      currUser.password = hashedPassword;
    }

    await currUser.save();
    req.session.user.name = currUser.name;
    req.session.user.email = currUser.email;
    res.redirect("/editprofile?success=Profile Updated Successfully");


  } catch (error) {
    console.log(error);
    res.send("Something went wrong while updating profile");
  }
};

