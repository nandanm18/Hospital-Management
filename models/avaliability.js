const mongoose = require("mongoose");
const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctorModel",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  morning: {
    available:{type:Boolean,default:false},
    capacity: { type: Number, default: 50 },
    booked: { type: Number, default: 0 },
  },
  evening: {
    available:{type:Boolean,default:false},
    capacity: { type: Number, default: 40 },
    booked: { type: Number, default: 0 },
  }
});

availabilitySchema.index({ doctorId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model("Availability", availabilitySchema);
