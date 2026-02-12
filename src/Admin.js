import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


function Admin() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [errors, setErrors] = useState({}); // ✅ Validation errors

  const [form, setForm] = useState({
    title: "",
    description: "",
    fees: ""
  });

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const loadCourses = () => {
    axios.get("http://localhost:3001/courses")
      .then(res => setCourses(res.data));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openAddForm = () => {
    setForm({ title: "", description: "", fees: "" });
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openEditForm = (c) => {
    setEditId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      fees: c.fees
    });
    setErrors({});
    setShowModal(true);
  };

  // ✅ Validation Function
  const validateForm = () => {
    let newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Course name is required";
    } else if (form.title.length < 3) {
      newErrors.title = "Minimum 3 characters required";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.length < 5) {
      newErrors.description = "Minimum 5 characters required";
    }

    if (!form.fees) {
      newErrors.fees = "Fees is required";
    } else if (Number(form.fees) <= 0) {
      newErrors.fees = "Fees must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveCourse = () => {
    if (!validateForm()) return; 

    const apiCall = editId
      ? axios.put(`http://localhost:3001/update-course/${editId}`, form)
      : axios.post("http://localhost:3001/add-course", form);

    apiCall.then(() => {
      setToast(editId ? "Course updated successfully" : "Course added successfully");
      setTimeout(() => setToast(""), 3000);
      setShowModal(false);
      setErrors({});
      loadCourses();
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:3001/delete-course/${deleteId}`)
      .then(() => {
        setToast("Course deleted successfully");
        setTimeout(() => setToast(""), 3000);
        setShowConfirm(false);
        loadCourses();
      });
  };

  return (
    <div className="container">

      {toast && <div className="toast">{toast}</div>}

      <h2 className="student-dashboard">
        <MdAdminPanelSettings /> ADMIN DASHBOARD
      </h2>
      <hr className="custom-line" />

      <div className="breadcrumb-bar">
        <span className="breadcrumb-link" onClick={() => navigate("/student")}>
          Dashboard
        </span>
        <span className="breadcrumb-separator"> ›</span>
        <span className="breadcrumb-current"> Courses</span>
      </div>

      <div className="top-bar">
        <button className="btn-primary" onClick={openAddForm}>
          <IoMdAdd size="1.2rem" /> Add Course
        </button>

        <button className="btn-danger" onClick={logout}>
          <TbLogout2 /> Logout
        </button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Description</th>
            <th>Fees</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                ❌ No courses found
              </td>
            </tr>
          ) : (
            courses.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>₹{c.fees}</td>
                <td className="action-icons">
                  <FaEdit
                    className="icon edit-icon"
                    title="Edit Course"
                    onClick={() => openEditForm(c)}
                  />

                  <FaTrash
                    className="icon delete-icon"
                    title="Delete Course"
                    onClick={() => handleDeleteClick(c.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? "Update Course" : "Add Course"}</h3>

              <IoClose
                className="close-icon"
                onClick={() => setShowModal(false)}
              />
            </div>
            <hr className="model-custom-line" />
            <input
              className={errors.title ? "input-error" : ""}
              placeholder="Course Name"
              name="courseName"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}

            <input
              className={errors.description ? "input-error" : ""}
              placeholder="Description"
              name="description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <p className="error-text">{errors.description}</p>}

            <input
              type="number"
              className={errors.fees ? "input-error" : ""}
              placeholder="Fees"
              name="fees"
              value={form.fees}
              onChange={e => setForm({ ...form, fees: e.target.value })}
            />
            {errors.fees && <p className="error-text">{errors.fees}</p>}

            <div className="modal-actions">
              <button className="btn-primary" onClick={saveCourse}>Save</button>
              <button className="btn-danger" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Course</h3>

            <p style={{ marginTop: "10px" }}>
              Are you sure you want to delete this course?
            </p>

            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button className="btn-cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>

              <button className="btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;
