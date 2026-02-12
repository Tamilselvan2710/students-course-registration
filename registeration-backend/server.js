const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* LOGIN */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

/* ADMIN ADD COURSE */
app.post("/add-course", (req, res) => {
  const { title, description, fees } = req.body;
  db.query(
    "INSERT INTO courses (title, description, fees) VALUES (?, ?, ?)",
    [title, description, fees],
    (err) => {
      if (err) return res.send(err);
      res.send({ message: "Course added" });
    }
  );
});

/* ADMIN UPDATE COURSE */
app.put("/update-course/:id", (req, res) => {
  const { title, description, fees } = req.body;
  db.query(
    "UPDATE courses SET title=?, description=?, fees=? WHERE id=?",
    [title, description, fees, req.params.id],
    () => res.send({ message: "Updated" })
  );
});

/* ADMIN DELETE COURSE */

app.delete("/delete-course/:id", (req, res) => {
  db.query(
    "DELETE FROM courses WHERE id=?",
    [req.params.id],
    () => res.send({ message: "Deleted" })
  );
});


/* GET ALL COURSES */
app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, result) => res.send(result));
});

/* ENROLL COURSE */
app.post("/enroll", (req, res) => {
  const { user_id, course_id } = req.body;
  db.query(
    "INSERT INTO enrollments (user_id, course_id) VALUES (?,?)",
    [user_id, course_id],
    () => res.send({ message: "Enrolled" })
  );
});

/* GET ENROLLED COURSE IDS */
app.get("/enrolled/:userId", (req, res) => {
  db.query(
    "SELECT course_id FROM enrollments WHERE user_id=?",
    [req.params.userId],
    (err, result) => res.send(result)
  );
});

/* MY COURSES */
app.get("/my-courses/:userId", (req, res) => {
  const sql = `
    SELECT c.id, c.title, c.description
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.user_id = ?
  `;
  db.query(sql, [req.params.userId], (err, result) => res.send(result));
});

app.listen(3001, () =>
  console.log("Backend running on http://localhost:3001")
);
