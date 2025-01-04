const mongoose=require("mongoose");
const schema =mongoose.Schema;

let reviewSchema=new schema({
    rating:Number,
    comment:String,
    author:{
        type:schema.Types.ObjectId,
        ref:"User"
    }
})

let review=mongoose.model("review",reviewSchema);
module.exports=review;