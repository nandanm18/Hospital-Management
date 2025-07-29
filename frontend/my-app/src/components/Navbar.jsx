// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* <h3>🏥 Hospital Portal</h3> */}
      </div>
      <div className="nav-right">
        <Link to="/doctor/dashboard">Doctor</Link>
        <Link to="/patient/dashboard">Patient</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;