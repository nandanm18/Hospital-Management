import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import "./DoctorDashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function DoctorDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState({ morning: "yes", evening: "yes" });
  const [doctor, setDoctor] = useState({ name: "", specialization: "" });
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setShowDropdown(false);
    navigate("/");
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/doctors/appointments");
        setAppointments(res.data.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await api.get("/doctors/profile");
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor profile", err);
      }
    };

    fetchAppointments();
    fetchProfile();
  }, []);

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailability((prev) => ({ ...prev, [name]: value }));
  };

  const submitAvailability = async () => {
    try {
      await api.put("/doctors/availability", availability);
      alert("Availability updated");
    } catch (err) {
  console.error("Update availability error:", err.response || err);
  alert("Failed to update availability: " + (err.response?.data?.message || err.message));
}

  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="hospital-title">SARJI MULTI SPECIALITY HOSPITAL</h1>

        <button
          className="profile-button"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-label="Profile"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
            alt="Profile"
            className="profile-icon"
          />
        </button>

        {showDropdown && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      <div className="doctor-info">
        <p>{doctor.name}</p>
        <small>{doctor.specialization}</small>
      </div>

      <div className="dashboard-main">
        <aside className="dashboard-left">
          <div className="appointments">
            <h3>Appointments</h3>
            <div className="appointment-buttons">
              <button
                className="appointments-button"
                onClick={() => navigate("/doctor/appointments")}
              >
                View Appointments
              </button>
            </div>
          </div>

          <div className="calendar">
            <h3>This Month's Calendar</h3>
            <Calendar />
          </div>

          <div className="availability">
            <h3>Availability for Tomorrow</h3>
            <label>
              Morning:
              <input
                type="radio"
                name="morning"
                value="yes"
                checked={availability.morning === "yes"}
                onChange={handleAvailabilityChange}
              />{" "}
              Yes
              <input
                type="radio"
                name="morning"
                value="no"
                checked={availability.morning === "no"}
                onChange={handleAvailabilityChange}
              />{" "}
              No
            </label>
            <br />
            <label>
              Evening:
              <input
                type="radio"
                name="evening"
                value="yes"
                checked={availability.evening === "yes"}
                onChange={handleAvailabilityChange}
              />{" "}
              Yes
              <input
                type="radio"
                name="evening"
                value="no"
                checked={availability.evening === "no"}
                onChange={handleAvailabilityChange}
              />{" "}
              No
            </label>
            <br />
            <button onClick={submitAvailability}>Submit</button>
          </div>
        </aside>

        <section className="dashboard-right">
          <h2>Hospital Announcements</h2>
          <ul className="news-list">
            <li>🔔 COVID-19 booster shots available next week</li>
            <li>🔔 Dr. Aishwarya’s workshop on pediatrics this Friday</li>
            <li>🔔 Annual medical audit scheduled for 30th June</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default DoctorDashboard;
