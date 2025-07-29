const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  doctor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "doctorModel",
  required: true
},
patient: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Patient",
  required: true
},
  tablets: [
    {
      name: {
        type: String,
        required: true,
      },
      dose: {
        type: String, 
        required: true,
      },
      frequency: {
        type: Number,
        required: true,
      },
      timing: {
        type: [String],
        enum: ["morning", "afternoon", "evening", "night"],
        default: []
      }
    }
  ],
  prescribedDate: {
    type: Date,
    default: Date.now,
  }
});

const Prescription= mongoose.model("Prescription", prescriptionSchema);
module.exports=Prescription;
