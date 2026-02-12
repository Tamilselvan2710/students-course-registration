import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Student from "./Student";
import Admin from "./Admin";
import MyCourses from "./MyCourses";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/student" element={
          <ProtectedRoute>
            <Student />
          </ProtectedRoute>
        } />

        <Route path="/my-courses" element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
