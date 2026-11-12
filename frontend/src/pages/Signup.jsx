import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { asset } from "../utils/asset";
import "../styles/signup_style.css";

const EMPTY_FORM = { fullname: "", email: "", phone: "", password: "", confirm_password: "" };

export default function Signup() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await signup(form);
      showToast("Signup successful");
      navigate("/login");
    } catch (err) {
      const fieldErrors = err.data && typeof err.data === "object" ? err.data : {};
      setErrors(fieldErrors);
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (name) => errors[name] && errors[name][0];

  return (
    <div className="signup-container">
      {/* Left Side */}
      <div className="left-panel" style={{ backgroundImage: `url(${asset("images/signup-bg.jpg")})` }}>
        <div className="overlay">
          <div className="welcome-text">
            <i className="fa-solid fa-plane"></i>
            <h1>Join Wanderly</h1>
            <p>Create your account and start exploring the world's most beautiful destinations today.</p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="right-panel">
        <div className="signup-box">
          <h2>Create Account</h2>
          <p>Fill in your details below.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                placeholder="Enter your full name"
                required
                value={form.fullname}
                onChange={handleChange}
              />
              {fieldError("fullname") && <span className="field-error">{fieldError("fullname")}</span>}
            </div>

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
              {fieldError("email") && <span className="field-error">{fieldError("email")}</span>}
            </div>

            <div className="input-box">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                required
                value={form.phone}
                onChange={handleChange}
              />
              {fieldError("phone") && <span className="field-error">{fieldError("phone")}</span>}
            </div>

            <div className="input-box">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                required
                value={form.password}
                onChange={handleChange}
              />
              {fieldError("password") && <span className="field-error">{fieldError("password")}</span>}
            </div>

            <div className="input-box">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm password"
                required
                value={form.confirm_password}
                onChange={handleChange}
              />
              {fieldError("confirm_password") && (
                <span className="field-error">{fieldError("confirm_password")}</span>
              )}
            </div>

            <button type="submit" disabled={submitting}>
              <i className="fa-solid fa-user-plus"></i>
              {submitting ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
