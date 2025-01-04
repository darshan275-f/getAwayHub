const express=require("express");
const Listing=require("./models/listing.js");
const review = require("./models/reviews.js");
const expressError = require("./utilities/expressError.js");
const app=express();

module.exports.validateLoggedIn= ((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("failure","You should be Logged In First");
        return res.redirect("/login");
    }
    next();
    })
module.exports.validateUser=(async (req,res,next)=>{
    let {id} =req.params;
    let list=await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.current_user._id)) {
          req.flash("failure","You don't have access to Edit it");
          return res.redirect(`/listings/${id}`);
      }
      next();
})

module.exports.validateAuthor=(async(req,res,next)=>{
    let {id,reviewid} =req.params;
    let reviews=await review.findById(reviewid);
    if(!reviews.author._id.equals(res.locals.current_user._id)) {
          req.flash("failure","You don'r have access to delete it");
          return res.redirect(`/listings/${id}`);
      }
      next();
})

