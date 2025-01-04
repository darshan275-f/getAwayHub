const mongoose=require("mongoose");
const schema =mongoose.Schema;
const review=require("./reviews.js");
const User=require("./user.js");
const { string } = require("joi");

const listingOptions=new schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
       url:String,
      filename:String
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String
    },
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
})

listingOptions.post("findOneAndDelete",async(list)=>{
   
    if(list && list.reviews){
        await review.deleteMany({_id:list.reviews});
    }
})
const Listing=mongoose.model("Listing",listingOptions);
module.exports=Listing;