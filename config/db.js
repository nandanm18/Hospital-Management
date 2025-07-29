const mongoose=require("mongoose");
require('dotenv').config();
const connectDb= async()=>{
    try{
        console.log("please wait connecting to db");
        const db=await mongoose.connect(await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }));
        console.log("connected succesfully");
    }
    catch(err){
        console.log("unable to connect due to",err);
    }
}
module.exports= connectDb;