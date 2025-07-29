const Patient=require("../models/patientModel");
const Appointment = require("../models/appointmentModel");
const Prescription = require("../models/prescriptionModel");
const Availability=require("../models/avaliability")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const avaliability = require("../models/avaliability");
const doctor = require("../models/doctorModel"); // adjust path as needed

const mongoose = require('mongoose');

const registerPatient = async (req, res) => {
  try {
    const { name, email, phone, password,address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); 

    const newPatient = new Patient({
      name,
      email,
      phone,
      password: hashedPassword,
      address
    });

    await newPatient.save();

    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const patientLogin=async (req,res)=>{
  try{
    const {email,password}=req.body;
    const user= await Patient.findOne({email});
    if(!user)
      res.status(400).json({"message":"register first"});
    const pcmp=await bcrypt.compare(password,user.password);
    if(!pcmp){
      res.status(400).json({"message":"invalid password"})
    }
const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: "patient"
    };


  const token=jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
      res.status(200).json({
      message: 'Login successful',
      token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
  })}

  catch(err){
    res.status(500).json({"message":err.message});
  }
  
}
const getProfile=async (req,res)=>{
    try{
        const patientId=req.user.id;
        const patientDetails=Patient.findById(patientId);
        if(!patientDetails){
            res.status(404).json({message:"patient not found"})
        }
        res.status(200).json(patientDetails)

    }
    catch(err){
      res.status(500).json({"msg":err.message})
    }
}

const dList = async (req, res) => {
  try {
    console.log("started dlist controller");
    const now = new Date();

    const startOfTomorrow = new Date(now);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(startOfTomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);
    console.log(startOfTomorrow,endOfTomorrow)
    const doctorList = await Availability.find({
      date: { $gte: startOfTomorrow, $lte: endOfTomorrow }
    })
    .populate("doctorId", "name specialization")
    

    if (!doctorList || doctorList.length === 0) {
      return res.status(200).json({ doctorList: [] });
    }

    console.log(doctorList);
    return res.status(200).json({ doctorList });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, timeSlot = "morning" } = req.body;
    const patientId = req.user.id;

    const today = new Date();
    const appointmentDate = new Date(today);
    appointmentDate.setDate(today.getDate() + 1);
    appointmentDate.setHours(0, 0, 0, 0);

    const availability = await Availability.findOneAndUpdate(
      {
        doctorId,
        date: appointmentDate,
        [`${timeSlot}.available`]: true,
        $expr: {
          $lt: [
            { $ifNull: [`$${timeSlot}.booked`, 0] },
            { $ifNull: [`$${timeSlot}.capacity`, 1] }
          ]
        }
      },
      {
        $inc: { [`${timeSlot}.booked`]: 1 }
      },
      { new: true }
    );

    if (!availability) {
      return res.status(400).json({ message: "No available slots for the selected time." });
    }

    const newAppointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      date: appointmentDate,
      status: "confirmed",
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });

  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const History = async (req, res) => {
  try {
    const patient = req.user.id;
    const prescriptions = await Prescription.find({ patient })
      .populate("doctor", "name specialization")
      .sort({ date: -1 });  // sort by date descending (recent first)

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for this patient" });
    }

    return res.status(200).json({prescriptions});
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getPatientPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.id; // from logged-in user
    const prescriptions = await Prescription.find({ patient: patientId })
      .sort({ date: -1 }) 
      .populate('doctor', 'name department')
      .exec();

    if (!prescriptions.length) {
      return res.status(404).json({ message: "No prescriptions found for this patient" });
    }

    res.status(200).json({ prescriptions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {registerPatient,patientLogin,getProfile,dList,bookAppointment,getPatientPrescriptions,History};

