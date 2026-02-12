import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email and Password are required");
      return;
    }

    const res = await axios.post("http://localhost:3001/login", {
      email,
      password
    });

    if (res.data.length > 0) {
      localStorage.setItem("user", JSON.stringify(res.data[0]));

      if (res.data[0].role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/student", { replace: true });
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div class="login-card">
        <div class="login-container">
          <div class="login-header">Sign In</div>
          <div class="login-header-content">Enter your credentials to access your account</div>
        </div>
        <div class="login-body">
            <input className="input-field" name="userName" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input className="input-field" name="password" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <div class="options">
              <label>
                  <input type="checkbox" />
                  Remember me
              </label>
              <a href="/">Forgot password?</a>
            </div>
            <button className="login-btn" onClick={handleLogin}>Login</button>
            <div class="signup-text">Not a member? <a href="/">Signup now</a></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
