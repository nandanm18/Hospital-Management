const express=require("express");
const {registerPatient,bookAppointment,getPatientDetails,listAppointments}=require('../controllers/receptionistController')
const route=express.Router();

route.post('/register-patient',registerPatient);
route.post('/book-appointment',bookAppointment);
route.get('/:patientID',getPatientDetails);
route.get('/:doctorID',listAppointments);
module.exports=route;