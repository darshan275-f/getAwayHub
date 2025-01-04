const express =require("express");
const mongoose=require("mongoose");
const path=require("path");

const Wrapasync=require("../utilities/Wrapasync.js");
const Listing=require("../models/listing.js");
const router=express.Router();
const {validateLoggedIn,validateUser}=require("../middleWare.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const maptoken=process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken:maptoken });
//index Route
router.get("/",Wrapasync(async (req,res)=>{
    let listing=await Listing.find({});
    // console.log(listing);
    res.render("./listings/index.ejs",{listing});
}));


//create route
router.get("/new",validateLoggedIn,(req,res)=>{
    
    res.render("./listings/new.ejs");
})
router.post("/new", upload.single('listing[image]'),Wrapasync(async(req,res)=>{
   
   let response= await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit: 1
      })
        .send()
     
       




    let url=req.file.path;
    let filename=req.file.filename;

    let listing=req.body.listing;
    let list = new Listing(listing);
    list.owner=req.user._id;
    list.image={url,filename};
    list.geometry=response.body.features[0].geometry; 
  
     await list.save();
     req.flash("success","Your new list has been successfully added!");
    res.redirect("/listings");
}))

//edit and update route
router.get("/edit/:id",validateLoggedIn,Wrapasync(async (req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    // console.log(list)
    res.render("./listings/edit.ejs",{list});
}))
router.put("/edit/:id", upload.single('listing[image]'),validateLoggedIn,validateUser,Wrapasync(async (req,res)=>{
   console.log(req.file);
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url);
     listing.image={url,filename};
     await listing.save();
    }
    
    // console.log(update);
    req.flash("success","Your list has been successfully updated!");
    res.redirect(`/listings/${id}`);
}))


//Delete Route
router.delete("/:id",validateLoggedIn,validateUser,Wrapasync(async (req,res)=>{
    let {id}=req.params;
    let del=await Listing.findByIdAndDelete(id);
    // console.log(del);
    req.flash("success","Your list has been successfully deleted!");
    res.redirect("/listings");
}))

router.get("/search",Wrapasync(async(req,res)=>{
    let {content}=req.query;
   
   content= content
        .toLowerCase() // Convert the entire string to lowercase
        .split(' ') // Split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(' '); 
    console.log(content)
    let list=await Listing.findOne({ title:content});
    if(list!=null){
        return res.redirect(`/listings/${list._id}`);
    }else{
       req.flash("failure","Oops! The page you're looking for isn't in the list.");
       res.redirect("/listings")
    }
}))


// show route
router.get("/:id",Wrapasync(async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner");
    // console.log(list);
    if(!list){
        req.flash("failure","The list you looking for it is not preseent in Listing");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{list});
}))




module.exports=router;