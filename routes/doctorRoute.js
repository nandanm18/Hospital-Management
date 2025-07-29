const express = require("express");
const router = express.Router();
const doctorMiddleware = require("../middlewares/doctorMiddleware");
const doctorController = require("../controllers/doctorsControllers");

// Protect doctor routes
router.post("/register",doctorController.doctorRegister);
router.post("/login",doctorController.doctorLogin);
router.get("/profile", doctorMiddleware, doctorController.doctorProfile);
router.put("/profile", doctorMiddleware, doctorController.updateDoctorProfile);
router.get("/appointments", doctorMiddleware, doctorController.appointmentList);
router.get("/prescriptions/:patientId", doctorMiddleware, doctorController.getPatientPrescriptions);
router.post("/prescription/add", doctorMiddleware, doctorController.addPrescription);
router.post("/admit", doctorMiddleware, doctorController.admitPatient);
router.post("/discharge", doctorMiddleware, doctorController.dischargePatient);
router.put("/availability",doctorMiddleware,doctorController.updateAvailability);

module.exports = router; 
