const express =require("express");
const Wrapasync=require("../utilities/Wrapasync.js");
const Listing=require("../models/listing.js");
const review=require("../models/reviews.js");
const route=express.Router({mergeParams:true});

const {validateLoggedIn,validateUser,validateAuthor}=require("../middleWare.js");
const expressError = require("../utilities/expressError.js");



route.post("/",validateLoggedIn,Wrapasync(async (req,res)=>{
    let {id} =req.params;
    let reviews=req.body.listing;
    // console.log(id);
    // console.log(rate,comment);
    // res.send("wroking");
    let review1=new review(reviews);
    let list=await Listing.findById(id);
    review1.author=req.user._id;
    console.log(review1)
    list.reviews.push(review1);
    console.log(list);
    await review1.save();
    await list.save();
    req.flash("success","Your new review has been successfully added!")
    res.redirect(`/listings/${id}`);
   

}))
route.delete("/:reviewid",validateLoggedIn,validateAuthor,Wrapasync(async (req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash("success","The review has been successfully deleted!");
    res.redirect(`/listings/${id}`);
}))

module.exports=route;