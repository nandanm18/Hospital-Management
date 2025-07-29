const Doctor= require("../models/doctorModel");
const Appointment=require("../models/appointmentModel");
const Prescription = require("../models/prescriptionModel");
const patientModel=require("../models/patientModel")
const Admission = require("../models/admissionModel")
const Availability=require("../models/avaliability")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const doctorRegister = async (req, res) => {
  try {
    console.log("at register controller")
    const { name, email, password, specialization, phone } = req.body;
    console.log(name)

    if (!name || !email || !password || !specialization || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const domain = email.split("@")[1];
    if (domain !== "sarji.ac.in") {
      return res.status(403).json({ message: "Only sarji.ac.in emails allowed" });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ message: "Doctor already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      specialization,
      phone
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor registered successfully" });
  } catch (err) {
    console.error("Error in doctorRegister:", err);
    res.status(500).json({ message: "Server error",error:err.message });
  }
};

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Doctor.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Register first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: "doctor" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Doctor Login Error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const doctorProfile=async (req,res)=>{
    try{
    const doctorid=req.user.id;
    console.log(doctorid)
    const doctor=await Doctor.findById(doctorid).select('-password');
    console.log(doctor)
    if(!doctor)
        return res.status(404).json({ message: "Doctor not found" });
    
    res.status(200).json(doctor);}
    catch(err){
        res.status(500).json({ message: "Server error", error: error.message });
    }

}
const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const updates = req.body;

    const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Profile updated", doctor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateAvailability = async (req, res) => {
  console.log("availability controller called");
  try {
    const doctorId = req.user.id;
    const { morning, evening } = req.body;

    if (!morning || !evening) {
      return res.status(400).json({ message: "Both morning and evening availability must be specified" });
    }
    const now = new Date();
    const startOfTomorrow = new Date(now);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(startOfTomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);
    let availability = await Availability.findOne({
      doctorId,
      date: { $gte: startOfTomorrow, $lte: endOfTomorrow }
    });

    if (!availability) {
      availability = new Availability({
        doctorId,
        date: startOfTomorrow, // store as midnight UTC
        morning: { available: morning === "yes", booked: 0, capacity: 50 },
        evening: { available: evening === "yes", booked: 0, capacity: 50 }
      });
    } else {
      availability.morning.available = morning === "yes";
      availability.evening.available = evening === "yes";
    }

    await availability.save();

    res.status(200).json({ message: "Availability updated successfully", availability });
    console.log(startOfTomorrow)

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const appointmentList = async (req, res) => {
  try {
    const doctorId = req.user.id;
    console.log("Doctor ID:", doctorId);

    const plist = await Appointment.find({ doctor: doctorId }).populate("patient","name").sort({date:1});
    console.log("Fetched:", plist);

    res.status(200).json({ appointments: plist });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getPatientPrescriptions = async (req, res) => {
  try {
    const doctorId = req.user.id; 
    const patientId = req.params.patientId;

    const prescriptions = await Prescription.find({ doctor: doctorId, patient: patientId })
      .sort({ date: -1 }) // most recent first
      .exec();

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for this patient by this doctor" });
    }
    res.status(200).json({ prescriptions});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const addPrescription = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId, tablets } = req.body;

    if (!patientId || !tablets || tablets.length === 0) {
      return res.status(400).json({ message: "Patient ID and tablets are required" });
    }


    const newPrescription = new Prescription({
      doctor: doctorId,
      patient: patientId,
      tablets: tablets,
    });

   
    await newPrescription.save();

    res.status(201).json({
      message: "Prescription added successfully",
      prescription: newPrescription,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const admitPatient = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { patientId, ward, roomNumber, reasonForAdmission } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "patientId is required" });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const activeAdmission = await Admission.findOne({ patientId, isActive: true });
    if (activeAdmission) {
      return res.status(400).json({ message: "Patient is already admitted" });
    }

    const admission = new Admission({
      patientId,
      admissionDate: new Date(),
      isActive: true,
      status: "admitted",
      ward: ward || "General", // Optional fallback
      roomNumber: roomNumber || "N/A",
      reasonForAdmission: reasonForAdmission || "Not specified",
      attendingDoctorId: doctorId,
    });

    await admission.save();

    res.status(201).json({ message: "Patient admitted successfully", admission });
  } catch (error) {
    console.error("Admit Patient Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const dischargePatient = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { admissionId } = req.body;

    if (!admissionId) {
      return res.status(400).json({ message: "admissionId is required" });
    }

    const admission = await Admission.findById(admissionId);
    if (!admission || !admission.isActive) {
      return res.status(404).json({ message: "Active admission record not found" });
    }

    if (admission.attendingDoctorId.toString() !== doctorId) {
      return res.status(403).json({ message: "Unauthorized to discharge this patient" });
    }

    admission.dischargeDate = new Date();
    admission.isActive = false;
    admission.status = "discharged";

    await admission.save();

    res.status(200).json({ message: "Patient discharged successfully", admission });
  } catch (error) {
    console.error("Discharge Patient Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = {doctorRegister,doctorLogin,doctorProfile,updateDoctorProfile,appointmentList,getPatientPrescriptions,addPrescription, admitPatient,
  dischargePatient,updateAvailability};
  