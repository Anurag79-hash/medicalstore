const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connectDB = require("./config/db");
const medicineController = require("./controllers/medicineController");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
require("dotenv").config();
const path=require("path");
connectDB();
app.use((req, res, next) => {
  res.locals.success = req.query.success || null;
  res.locals.error = req.query.error || null;
  next();
});

const adminRoutes=require("./routes/adminRoutes");
app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
//session
app.use(
  session({
    secret:"annu%_",
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({
      mongoUrl:process.env.MONGO_URI,
      ttl:24*60*60,
      autoRemove:"native",
    }),
    cookie:{
      maxAge:24*60*60*1000,
    }
   
  })
);
app.use((req,res,next)=>{
  res.locals.user=req.session.user||null
  next();
})

app.use("/",require("./routes/userRoutes"))
app.use("/admin",adminRoutes);

app.listen(4000, () => console.log("Server running at 4000"));
