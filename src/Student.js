import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa6";

function Student() {
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [toast, setToast] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    axios.get("http://localhost:3001/courses")
      .then(res => setCourses(res.data));

    axios.get(`http://localhost:3001/enrolled/${user.id}`)
      .then(res => setEnrolled(res.data.map(e => e.course_id)));
  }, [user.id]);

  const enroll = id => {
    axios.post("http://localhost:3001/enroll", {
      user_id: user.id,
      course_id: id
    }).then(() => {
      setEnrolled([...enrolled, id]);
      setToast("Course enrolled successfully");
      setTimeout(() => setToast(""), 3000);
    });
  };

  return (
    <div className="container">

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      <h2 className="student-dashboard">
        <FaUserGraduate /> STUDENT DASHBOARD
      </h2>
      <hr className="custom-line" />

      <div className="breadcrumb-bar">
        <span className="breadcrumb-link" onClick={() => navigate("/student")}>
          Dashboard</span>
        <span className="breadcrumb-separator"> ›</span>
        <span className="breadcrumb-current"> Available Courses</span>
      </div>

      <div className="top-bar">
        <a className="link" href="/my-courses">
          View My Enrolled Courses <FaArrowRight />
        </a>
        <button className="btn-danger" onClick={logout}>
          <TbLogout2 /> Logout
        </button>
      </div>

      <h2>Available Courses</h2>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                ❌ No courses available
              </td>
            </tr>
          ) : (
            courses.map(c => {
              const isEnrolled = enrolled.includes(c.id);
              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.title}</td>
                  <td>{c.description}</td>
                  <td>{isEnrolled ? "Enrolled" : "Not Enrolled"}</td>
                  <td>
                    <button
                      disabled={isEnrolled}
                      onClick={() => enroll(c.id)}
                      className={isEnrolled ? "btn-enrolled" : "btn-enroll"}
                    >
                      {isEnrolled ? "Enrolled" : "Enroll"}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Student;
