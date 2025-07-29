const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: { 
        type: String,
        required: true
    },
    date_of_report: Date,
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

const PatientModel = mongoose.model("Patient", patientSchema);
module.exports = PatientModel;
