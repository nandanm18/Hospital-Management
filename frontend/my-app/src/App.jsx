import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Navbar from "./components/Navbar";
import DoctorAppointments from "./pages/DoctorAppointments";
import PatientRegister from "./pages/PatientRegister";
import BookAppointment from "./pages/BookAppointment";
import History from "./pages/History";
import PrescriptionDetails from "./pages/PrescriptionDetails"; 
import AdmissionPage from "./pages/AdmissionPage";
function AppWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ["/", "/register", "/login/patient", "/register/patient"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/patient" element={<PatientRegister />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book-appointment" element={<BookAppointment />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/patient/history" element={<History />} />
        <Route path="/patient/history/:doctorId" element={<PrescriptionDetails />} />
        <Route path="/doctor/patient/:patientId/admission" element={<AdmissionPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
