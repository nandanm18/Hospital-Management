import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => setShowProfile((prev) => !prev);

  return (
    <div className="patient-dashboard-container">
      {/* Top bar */}
      <header className="dashboard-header">
        <h1 className="hospital-title">SARJI MULTI SPECIALITY HOSPITAL</h1>
        <div className="profile-section">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
            alt="Profile"
            className="profile-icon"
            onClick={toggleProfile}
          />
          {showProfile && (
            <div className="profile-dropdown">
              <p><strong>Patient Name</strong></p>
              <p>patient@example.com</p>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="dashboard-content">
        {/* Left sidebar navigation */}
        <nav className="dashboard-sidebar">
          <button onClick={() => navigate("/patient/book-appointment")}>Book Appointment</button>
          <button onClick={() => navigate("/patient/history")}>History</button>
        </nav>

        {/* Main content with announcements */}
        <main className="dashboard-main-content">
          <h2>Announcements</h2>
          <ul className="announcements-list">
            <li>💉 20% off on full body checkups this month</li>
            <li>🩺 Free blood sugar test for senior citizens every Friday</li>
            <li>🏥 Special pediatric consultation offers for children under 12</li>
            <li>🩹 Free follow-up checkups after any surgery for 3 months</li>
          </ul>
        </main>
      </div>
    </div>
  );
}

export default PatientDashboard;
