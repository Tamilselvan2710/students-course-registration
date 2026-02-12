import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUserGraduate } from "react-icons/fa6";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`http://localhost:3001/my-courses/${user.id}`)
      .then(res => setCourses(res.data));
  }, [user.id]);

  return (
    <div className="container">
      <h2 className="student-dashboard">
        <FaUserGraduate /> STUDENT DASHBOARD
      </h2>
      <hr className="custom-line" />

      <div className="breadcrumb-bar">
        <span className="breadcrumb-link" onClick={() => navigate("/student")}>
          Dashboard</span>
        <span className="breadcrumb-separator"> ›</span>
        <span className="breadcrumb-current"> My Courses</span>

        <button
          className="btn-secondary breadcrumb-back"
          onClick={() => navigate("/student")}> <IoMdArrowRoundBack /> Back to Course</button>
      </div>

      <h2>My Enrolled Courses</h2>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                  ❌ No enrolled courses found
                </td>
              </tr>
            ) : (
              courses.map((course, index) => (
                <tr key={course.id}>
                  <td>{index + 1}</td>
                  <td>{course.title}</td>
                  <td>
                    <span className="badge badge-success">
                      ✔ Enrolled
                    </span>
                  </td>
                </tr>
              ))
            )}
        </tbody>
      </table>
    </div>
  );
}

export default MyCourses;
