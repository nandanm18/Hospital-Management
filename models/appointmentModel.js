// models/appointmentModel.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patientModel",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctorModel", 
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending"
}
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
