const express = require("express");
const {
  registerPatient,
  patientLogin,
  getProfile,
  dList,
  bookAppointment,
  getPatientPrescriptions,History
} = require("../controllers/patientControllers");

const patientMiddleware = require("../middlewares/patientMiddleware");

const router = express.Router();

// Public routes
router.post('/register', registerPatient);
router.post('/login', patientLogin);

// Protected routes
router.get('/profile', patientMiddleware, getProfile);
router.get("/available-doctors",dList)
router.post('/book-appointment', patientMiddleware, bookAppointment);
router.get('/history',patientMiddleware,History);
router.get('/prescriptionList', patientMiddleware, getPatientPrescriptions);

module.exports = router;
