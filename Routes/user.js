
const express =require("express");
const route=express.Router();
const User=require("../models/user");
const passport = require("passport");
const {validateLoggedIn}=require("../middleWare");
const Wrapasync=require("../utilities/Wrapasync.js");

route.get("/signUp",(req,res)=>{
    res.render("./user/signUp.ejs");
})

let saveurl =(req,res,next)=>{
    req.locals.url=req.session.redirect;
    next();
}


route.post("/signUp",Wrapasync(async (req,res)=>{
    try{
        let {email,username,password}=req.body;
        let userdata=new User({email,username});
        let data=await User.register(userdata,password);
        req.logIn(data,(err)=>{
            if(err){
                return next(err);
            }
            else{
                req.flash("success","Welcome back! Signed in successfully. 🎉");
        res.redirect("/listings");
            }
        })
        
    
    }
    catch{
        req.flash("failure","This user already exists. Please try logging in!");
        res.redirect("/listings");
    }

}))

route.get("/login",(req,res)=>{
    res.render("./user/login.ejs");
})

route.post("/login", passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),Wrapasync(async(req,res)=>{
    req.flash("success","Welcome back! You’ve logged in successfully. 🎉");
    let urls= "/listings";
    res.redirect("/listings");
}))


route.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        else{
            req.flash("success","You’ve logged out successfully. See you next time! 👋");
            res.redirect("/listings");
        }
        
    })
})
module.exports=route;