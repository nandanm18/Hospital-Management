import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/doctors/login", {
        email: doctorEmail,
        password: doctorPassword,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "doctor");
      navigate("/doctor/dashboard");
    } catch (error) {
      alert("Doctor login failed: " + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/patients/login", {
        email: patientEmail,
        password: patientPassword,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "patient");
      navigate("/patient/dashboard");
    } catch (error) {
      alert("Patient login failed: " + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="hospital-header">
        <h1>SARJI MULTI SPECIALITY HOSPITAL</h1>
        <p>146, Infantry Road, Opp. Police Commissioners Office, Bengaluru, Karnataka 560001</p>
      </div>

      <div className="doctor-marquee">
        <div className="marquee-content">
          "Wherever the art of medicine is loved, there is also a love of humanity." – Hippocrates
        </div>
      </div>

      <div className="login-columns">
        <div className="login-card">
          <h2>Doctor Login</h2>
          <form onSubmit={handleDoctorLogin}>
            <input
              type="email"
              placeholder="Doctor Email"
              value={doctorEmail}
              onChange={(e) => setDoctorEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={doctorPassword}
              onChange={(e) => setDoctorPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <p className="register-link">
            New doctor? <a href="/register">Register</a>
          </p>
        </div>

        <div className="login-card">
          <h2>Patient Login</h2>
          <form onSubmit={handlePatientLogin}>
            <input
              type="email"
              placeholder="Patient Email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={patientPassword}
              onChange={(e) => setPatientPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
<p className="register-link">
  New patient? <a href="/register/patient">Register</a>
</p>


        </div>
      </div>
    </div>
  );
}

export default Login;
