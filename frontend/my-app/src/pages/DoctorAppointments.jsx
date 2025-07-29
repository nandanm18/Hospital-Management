import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./DoctorAppointments.css";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctor info
        const doctorRes = await api.get("/doctors/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDoctorName(doctorRes.data.name || "Doctor");

        // Fetch appointments
        const res = await api.get("/doctors/appointments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAppointments(res.data.appointments || []);
        setError("");
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewClick = (appointment) => {
    navigate(`/doctor/patient/${appointment.patient._id}`, {
      state: { appointment },
    });
  };

  return (
    <div className="appointments-page">
      <h2 className="appointments-title">Dr. {doctorName}'s Appointments</h2>

      {loading ? (
        <p className="loading">Loading appointments...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : appointments.length === 0 ? (
        <p className="no-appointments">No appointments scheduled.</p>
      ) : (
        <div className="appointment-list">
          {appointments.map((apt, idx) => (
            <div className="appointment-card" key={idx}>
              <div className="appointment-info">
                <p>
                  <strong>Patient:</strong> {apt.patient?.name || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(apt.date).toLocaleString()}
                </p>
              </div>
              <button
                className="view-button"
                onClick={() => handleViewClick(apt)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;
