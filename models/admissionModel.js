const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patientModel',
    required: true,
  },
  admissionDate: {
    type: Date,
    required: true,
  },
  dischargeDate: {
    type: Date, 
  },
  isActive: {
    type: Boolean,
    default: true, 
  },
  status: {
    type: String,
    enum: ["admitted", "discharged", "transferred"],
    default: "admitted",
  },
  ward: {
    type: String,
  },
  roomNumber: {
    type: String,
  },
  reasonForAdmission: {
    type: String,
  },
  attendingDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctorModel',
  },
}, { timestamps: true });

module.exports = mongoose.model('AdmissionModel', admissionSchema);
