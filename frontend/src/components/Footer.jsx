import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../context/ToastContext";
import * as api from "../api/wanderly";

export default function Footer() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.subscribeNewsletter(email);
      showToast("Subscribed successfully");
      setEmail("");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="row gy-4">
          {/* Company */}
          <div className="col-lg-3 col-md-6">
            <h5>Wanderly</h5>
            <p>
              Let's make your next journey joyful and adventurous. Explore the world with comfort,
              safety, and unforgettable experiences.
            </p>
            <div className="social">
              <a href="https://www.facebook.com/wanderly_trails" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/wanderly_trails" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://x.com/wanderly_trails" target="_blank" rel="noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.youtube.com/@wanderly_trails" target="_blank" rel="noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/explore">Explore</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Top Destinations */}
          <div className="col-lg-2 col-md-6">
            <h5>Top Destinations</h5>
            <ul>
              <li><Link to="/explore?destination=Goa">Goa</Link></li>
              <li><Link to="/explore?destination=Bali">Bali</Link></li>
              <li><Link to="/explore?destination=Switzerland">Switzerland</Link></li>
              <li><Link to="/explore?destination=Japan">Japan</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6">
            <h5>Support</h5>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h5>Newsletter</h5>
            <p>Subscribe to receive our latest travel offers and updates.</p>
            <form onSubmit={handleSubscribe}>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr />

        <div className="text-center">
          <p className="mb-1">
            © 2026 <strong>Wanderly Travel</strong>. All Rights Reserved.
          </p>
          <p className="small text-light">
            Designed &amp; Developed by <strong>Dheebash V N</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
