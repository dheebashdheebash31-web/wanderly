import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import * as api from "../api/wanderly";
import "../styles/contact_style.css";

const HOURS = [
  { icon: "fa-clock", title: "Monday - Friday", text: "09:00 AM - 06:00 PM" },
  { icon: "fa-calendar-week", title: "Saturday", text: "10:00 AM - 04:00 PM" },
  { icon: "fa-calendar-xmark", title: "Sunday", text: "Closed" },
];

const WHY_CONTACT = [
  { icon: "fa-headset", title: "24/7 Support", text: "Our travel experts are always ready to assist you." },
  { icon: "fa-plane-departure", title: "Easy Booking", text: "Book your dream vacation quickly and securely." },
  { icon: "fa-tags", title: "Best Prices", text: "Enjoy exclusive travel deals and affordable packages." },
  { icon: "fa-shield-heart", title: "Trusted Service", text: "Thousands of happy travelers trust Wanderly." },
];

const FAQS = [
  { q: "How do I book a trip?", a: "Browse destinations, choose your favorite package, and contact us to complete your booking." },
  { q: "Can I cancel my booking?", a: "Yes. Cancellation policies depend on your selected package." },
  { q: "Do you offer international tours?", a: "Yes. We provide both domestic and international travel packages." },
  { q: "How can I contact support?", a: "You can send us a message using the contact form, or email us at info@wanderly.com." },
];

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.sendContactMessage(form);
      showToast(res.detail || "Message sent successfully!");
      setForm(EMPTY_FORM);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <section className="contact-hero">
        <h1>Contact Us</h1>
        <p>Have questions about your next trip? Our travel experts are here to help you.</p>
      </section>

      <section className="contact">
        <div className="contact-container">
          {/* Left */}
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>We'd love to hear from you. Feel free to contact us anytime.</p>

            <div className="info-box">
              <i className="fa-solid fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <p>info@wanderly.com</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fa-solid fa-phone"></i>
              <div>
                <h4>Phone</h4>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fa-solid fa-location-dot"></i>
              <div>
                <h4>Address</h4>
                <p>
                  125 Travel Street
                  <br />
                  Adventure City, India
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="contact-form">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                value={form.subject}
                onChange={handleChange}
              />
              <textarea
                name="message"
                rows="6"
                placeholder="Write your message..."
                required
                value={form.message}
                onChange={handleChange}
              ></textarea>
              <button type="submit" disabled={submitting}>
                <i className="fa-solid fa-paper-plane"></i>
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="map-section">
        <h2>Find Us</h2>
        <div className="line"></div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps?q=Coimbatore,Tamil%20Nadu&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Wanderly office location"
          ></iframe>
        </div>
      </section>

      <section className="follow-section">
        <h2>Follow Wanderly</h2>
        <p>Stay connected for the latest travel updates, offers and destination guides.</p>
        <div className="social-icons">
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
      </section>

      <section className="office-hours">
        <h2>Office Hours</h2>
        <div className="hours-grid">
          {HOURS.map((h) => (
            <div className="hour-card" key={h.title}>
              <i className={`fa-solid ${h.icon}`}></i>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="why-contact">
        <h2>Why Contact Wanderly?</h2>
        <div className="why-grid">
          {WHY_CONTACT.map((w) => (
            <div className="why-card" key={w.title}>
              <i className={`fa-solid ${w.icon}`}></i>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {FAQS.map((f) => (
          <div className="faq" key={f.q}>
            <h4>{f.q}</h4>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <Footer />
    </>
  );
}
