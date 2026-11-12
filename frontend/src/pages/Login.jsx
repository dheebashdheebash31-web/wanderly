import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ApiError } from "../api/client";
import { asset } from "../utils/asset";
import "../styles/login_style.css";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const me = await login({ email: form.email, password: form.password });
      showToast("Login successful");
      // Admins land on the admin panel; normal users see the website.
      const redirectTo = me.is_staff ? "/admin-panel" : location.state?.from || "/";
      navigate(redirectTo);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Invalid login details";
      setError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel */}
      <div className="left-panel" style={{ backgroundImage: `url(${asset("images/login-bg.jpg")})` }}>
        <div className="overlay">
          <div className="welcome-text">
            <i className="fa-solid fa-plane"></i>
            <h1>Welcome Back!</h1>
            <p>Login to continue your journey, discover amazing destinations, and explore the world with Wanderly.</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="login-box">
          <h2>Login</h2>
          <p>Enter your credentials to access your account.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && <span className="field-error">{error}</span>}

            <div className="options">
              <label>
                <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
                Remember Me
              </label>
              <a href="#forgot-password" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            <button type="submit" disabled={submitting}>
              <i className="fa-solid fa-right-to-bracket"></i>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="signup">
            Don't have an account? <Link to="/signup">Create Account</Link>
          </div>

          <hr />

          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-icons">
              <a href="https://accounts.google.com/">
                <i className="fab fa-google"></i>
              </a>
              <a href="https://www.facebook.com/login/">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://github.com/login">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
