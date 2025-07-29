import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookAppointment.css";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/patients/available-doctors", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        console.log("Fetched doctors:", data.doctorList);

        if (res.ok) {
          setDoctors(data.doctorList || []);
        } else {
          setError(data.msg || "Failed to load doctors");
          setDoctors([]);
        }
      } catch (err) {
        setError("Error loading doctors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDoctors();
  }, []);

  const handleBook = async (doctorId, timeSlot) => {
    try {
      const res = await fetch("http://localhost:5000/api/patients/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ doctorId, timeSlot }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Appointment booked successfully!");
        navigate("/patient/dashboard");
      } else {
        alert(data.message || "Booking failed");
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (doctors.length === 0) return <p>No doctors available for tomorrow.</p>;

  return (
    <div className="book-appointment-container">
      <h2>Available Doctors for Tomorrow</h2>
      <div className="doctor-list">
        {doctors.map((doc) => {
          const doctor = doc.doctorId || {};
          return (
            <div key={doc._id} className="doctor-row">
              <div className="doctor-details">
                <p className="doctor-name">{doctor.name || "No Name"}</p>
                <p className="doctor-specialization">{doctor.department || doctor.specialization || "No Department"}</p>
              </div>

              <div className="time-slot-buttons">
                {/* Morning slot */}
                {doc.morning?.available ? (
                  <button
                    className="book-button"
                    onClick={() => handleBook(doctor._id, "morning")}
                  >
                    Book Morning
                  </button>
                ) : (
                  <button className="book-button disabled" disabled>
                    Morning Full
                  </button>
                )}

                {/* Evening slot */}
                {doc.evening?.available ? (
                  <button
                    className="book-button"
                    onClick={() => handleBook(doctor._id, "evening")}
                  >
                    Book Evening
                  </button>
                ) : (
                  <button className="book-button disabled" disabled>
                    Evening Full
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookAppointment;
