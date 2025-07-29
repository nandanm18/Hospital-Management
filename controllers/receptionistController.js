const Patient = require("../models/patientModel");
const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");


const receptionistLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Receptionist.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Please register first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: "receptionist"
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Receptionist Login Error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
const registerPatient = async (req, res) => {
  try {
    const { name, phone, age, gender, address } = req.body;

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }
    let patient = await Patient.findOne({ phone });
    if (patient) {
      return res.status(400).json({ message: "Patient with this phone already exists" });
    }
    patient = new Patient({ name, phone, age, gender, address });
    await patient.save();

    res.status(201).json({ message: "Patient registered successfully", patient });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate } = req.body;

    if (!patientId || !doctorId || !appointmentDate) {
      return res.status(400).json({ message: "patientId, doctorId, and appointmentDate are required" });
    }

    // Optional: Validate patient and doctor exist
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const newAppointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      status: "booked",
    });

    await newAppointment.save();

    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getPatientDetails = async (req, res) => {
  try {
    const { phone, patientId } = req.query;

    let patient;

    if (patientId) {
      patient = await Patient.findById(patientId);
    } else if (phone) {
      patient = await Patient.findOne({ phone });
    } else {
      return res.status(400).json({ message: "Please provide patientId or phone" });
    }

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const listAppointments = async (req, res) => {
  try {
    const { doctorId, patientId, startDate, endDate } = req.query;

    let filter = {};

    if (doctorId) filter.doctor = doctorId;
    if (patientId) filter.patient = patientId;

    if (startDate || endDate) {
      filter.appointmentDate = {};
      if (startDate) filter.appointmentDate.$gte = new Date(startDate);
      if (endDate) filter.appointmentDate.$lte = new Date(endDate);
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "-password")
      .populate("doctor", "-password")
      .sort({ appointmentDate: 1 })
      .exec();

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  receptionistLogin,
  registerPatient,
  bookAppointment,
  getPatientDetails,
  listAppointments,
};
