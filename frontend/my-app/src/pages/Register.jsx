import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Login.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const domain = form.email.split("@")[1];
    if (domain !== "sarji.ac.in") {
      alert("Only sarji.ac.in email addresses are allowed.");
      return;
    }

    try {
      await api.post("/doctors/register", form); 
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      alert("Registration failed: " + (error.response?.data?.message || error.message));
    }
  };

  const specializationOptions = [
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "General Physician",
    "Gynecologist",
    "Hematologist",
    "Infectious Disease Specialist",
    "Nephrologist",
    "Neurologist",
    "Oncologist",
    "Ophthalmologist",
    "Orthopedic Surgeon",
    "ENT Specialist",
    "Pediatrician",
    "Psychiatrist",
    "Pulmonologist",
    "Radiologist",
    "Rheumatologist",
    "Surgeon",
    "Urologist"
  ];

  return (
    <div className="login-wrapper">
      <div className="hospital-header">
        <h1>SARJI MULTI SPECIALITY HOSPITAL</h1>
        <p>146, Infantry Road, Opp. Police Commissioners Office, Bengaluru, Karnataka 560001</p>
      </div>

      <div className="login-columns">
        <div className="login-card">
          <h2>Doctor Registration</h2>
          <form onSubmit={handleRegister}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <input
              name="specialization"
              list="specializationList"
              placeholder="Select or Type Specialization"
              value={form.specialization}
              onChange={handleChange}
              required
            />
            <datalist id="specializationList">
              {specializationOptions.map((spec, index) => (
                <option key={index} value={spec} />
              ))}
            </datalist>

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <button type="submit">Register</button>
          </form>
          <p className="register-link">
            Already registered? <a href="/">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
