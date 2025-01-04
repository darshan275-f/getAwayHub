const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    let listing=await Listing.find({});
    // console.log(listing);
    res.render("./listings/index.ejs",{listing});
}