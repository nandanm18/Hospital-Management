import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./History.css";

function PrescriptionHistory() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/patients/history", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setPrescriptions(res.data.prescriptions || []);
        setError("");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch history");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Extract unique doctors
  const uniqueDoctors = Array.from(
    new Map(prescriptions.map((p) => [p.doctor._id, p.doctor])).values()
  );

  const handleDoctorClick = (doctorId) => {
    navigate(`/patient/history/${doctorId}`);
  };

  return (
    <div className="page-container">
      <header className="header">Sarji Multi Speciality Hospital</header>

      <div className="marquee-container" aria-label="Hospital quote">
        <p className="marquee-text">
          "Your health is our priority — Compassion, Care & Commitment."
        </p>
      </div>

      <h2 className="section-heading">Doctors</h2>

      <ul className="doctor-list">
        {uniqueDoctors.map((doctor) => (
          <li
            key={doctor._id}
            onClick={() => handleDoctorClick(doctor._id)}
            className="doctor-item"
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            <span className="doctor-name">{doctor.name}</span> -{" "}
            <span className="doctor-specialization">{doctor.specialization}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PrescriptionHistory;
