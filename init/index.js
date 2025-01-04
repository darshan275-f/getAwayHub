const mongoose =require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
main().then(()=>console.log("db connected sucessfully")).catch((err)=>console.log(err));
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/getawayHub');
}

data().then(()=>{
    console.log("Data Saved");
})
.catch((err)=>{
    console.log(err);
})
async function data(){
   const deleteListings= await Listing.deleteMany({});
   initData.data=initData.data.map((obj=>({...obj,owner:'67783b9dc2d51bd9291f8b66'})))
   initData.data=initData.data.map((obj=>({...obj, geometry: { type: 'Point', coordinates: [ 74.054111, 15.325556 ] }})))
   const allData=await Listing.insertMany(initData.data);
}
