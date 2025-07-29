const connectDb=require("./config/db");
const express=require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const doctorRoutes = require('./routes/doctorRoute');
const patientRoutes = require('./routes/patientRoutes');
const receptionistRoutes = require('./routes/receptionistRoutes');
require('dotenv').config();
const app= express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());    
console.log("app started");
connectDb();
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/receptionists', receptionistRoutes);
app.get('/', (req, res) => {
  res.send('Hospital Management API Running...');
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));