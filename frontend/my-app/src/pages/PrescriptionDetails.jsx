import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "./History.css";
import "./PrescriptionDetails.css";


function PrescriptionDetails() {
  const { doctorId } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/patients/history", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const allPrescriptions = res.data.prescriptions || [];
        const filtered = allPrescriptions.filter(
          (p) => p.doctor._id === doctorId
        );
        setPrescriptions(filtered);
        setDoctor(filtered.length > 0 ? filtered[0].doctor : null);
        setError("");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch prescriptions");
      })
      .finally(() => setLoading(false));
  }, [doctorId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!doctor) return <div>No prescriptions found for this doctor.</div>;

  return (
    <div className="page-container">
      <header className="header">Sarji Multi Speciality Hospital</header>

      <div className="marquee-container" aria-label="Hospital quote">
        <p className="marquee-text">
          "Your health is our priority — Compassion, Care & Commitment."
        </p>
      </div>

      <h2 className="section-heading">
        Prescriptions for Dr. {doctor.name} - {doctor.specialization}
      </h2>

      <Link to="/patient/history" className="back-link">← Back to Doctors</Link>

      <div className="prescriptions-details">
        {prescriptions.map((prescription) => (
          <div key={prescription._id} className="prescription-card">
            <p><strong>Date:</strong> {new Date(prescription.prescribedDate).toLocaleDateString()}</p>
            <ul>
              {prescription.tablets.map((tablet, i) => (
                <li key={i}>
                  <strong>{tablet.name}</strong> - Dose: {tablet.dose}, Frequency: {tablet.frequency} times/day, Timing: {tablet.timing.join(", ")}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrescriptionDetails;
