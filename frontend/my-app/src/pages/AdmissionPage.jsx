import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosConfig"; // axios instance with baseURL and auth header
import "./AdmissionPage.css";

function AdmissionPage() {
  const { patientId } = useParams();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch admission info
  const fetchAdmission = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admissions/${patientId}`);
      setAdmission(res.data.admission);
      setError("");
    } catch (err) {
      setAdmission(null);
      setError(err.response?.data?.message || "Failed to fetch admission");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmission();
  }, [patientId]);

  const handleAdmit = async () => {
    try {
      const res = await api.post("/admissions", {
        patientId,
        ward: "General",        // You can add input fields for these if you want
        roomNumber: "101",
        reasonForAdmission: "Appointment diagnosis",
      });
      setMessage(res.data.message);
      fetchAdmission();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to admit patient");
    }
  };

  const handleDischarge = async () => {
    try {
      if (!admission) return;
      const res = await api.put("/admissions/discharge", {
        admissionId: admission._id,
      });
      setMessage(res.data.message);
      fetchAdmission();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to discharge patient");
    }
  };

  if (loading) return <div>Loading admission data...</div>;

  return (
    <div className="admission-page">
      <h2>Patient Admission Details</h2>

      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      {admission ? (
        <>
          <p><strong>Status:</strong> {admission.status}</p>
          <p><strong>Admitted on:</strong> {new Date(admission.admissionDate).toLocaleString()}</p>
          {admission.status !== "discharged" && (
            <button onClick={handleDischarge}>Discharge Patient</button>
          )}
        </>
      ) : (
        <button onClick={handleAdmit}>Admit Patient</button>
      )}
    </div>
  );
}

export default AdmissionPage;
