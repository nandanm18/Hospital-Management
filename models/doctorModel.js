const mongoose=require('mongoose');
const dschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    specialization:{
        type:String,
        required:true 
    },
    date_of_join:Date,
    phone:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
       type:String,
        required:true,
    },
    years_of_experience:{
        type:Number,
    },
});
const doctorModel=mongoose.model("doctorModel",dschema);
module.exports=doctorModel;