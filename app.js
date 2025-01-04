
    require('dotenv').config();



const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const expressError = require("./utilities/expressError.js");
const listroute = require("./Routes/listings.js");
const reviewRoute = require("./Routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRoute=require("./Routes/user.js");

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("App is listening on " + port);
});
let dbUrl=process.env.ALTASDB_URL;
main().then(() => console.log("DB connected successfully")).catch((err) => console.log(err));


async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Corrected "viwes" to "views"
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "public")));

const store=MongoStore.create({
     mongoUrl: dbUrl,
     crypto: {
        secret:process.env.SECRET,
      },
      touchAfter:24*3600,
    
    })

    store.on("error",()=>{
        console.log("Error in mongo-session store");
    })
const sessioOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessioOptions)); 
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("failure");
    res.locals.current_user=req.user;
    next();
})



app.use("/listings", listroute);
app.use("/listings/:id/review", reviewRoute);
app.use("/",userRoute);

app.get("/", (req, res) => {
    res.render("./listings/home.ejs");
});

app.all("*",(req,res,next)=>{
   
    next(new expressError(404,"Not found"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="Somthing went wrong!"}=err;
    res.render("./listings/error.ejs",{message});
})
