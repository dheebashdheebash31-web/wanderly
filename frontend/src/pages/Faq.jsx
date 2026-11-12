import { Link } from "react-router-dom";
import BootstrapNavbar from "../components/BootstrapNavbar";
import "../styles/legal_style.css";

const FAQ_ITEMS = [
  { id: "q1", q: "How do I book a trip?", a: "Choose your destination, contact our team, confirm your booking, and enjoy your trip." },
  { id: "q2", q: "Can I cancel my booking?", a: "Yes. Cancellation depends on the package and cancellation policy." },
  { id: "q3", q: "Are flights included?", a: "Some packages include flights while others only include accommodation." },
  { id: "q4", q: "Can I customize my package?", a: "Yes. Wanderly offers customized travel packages based on your preferences." },
  { id: "q5", q: "How can I contact customer support?", a: "You can contact us through the Contact page or email us anytime." },
];

export default function Faq() {
  return (
    <div className="bg-light wanderly-legal-page">
      <BootstrapNavbar />

      <section className="bg-dark text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">
            <i className="fa-solid fa-circle-question"></i> Frequently Asked Questions
          </h1>
          <p className="lead">Find answers to the most commonly asked questions about Wanderly.</p>
        </div>
      </section>

      <section className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="accordion shadow rounded" id="faqAccordion">
              {FAQ_ITEMS.map((item, i) => (
                <div className="accordion-item" key={item.id}>
                  <h2 className="accordion-header">
                    <button
                      className={i === 0 ? "accordion-button" : "accordion-button collapsed"}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${item.id}`}
                    >
                      {item.q}
                    </button>
                  </h2>
                  <div
                    id={item.id}
                    className={i === 0 ? "accordion-collapse collapse show" : "accordion-collapse collapse"}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">{item.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Card */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card border-0 shadow-lg">
              <div className="card-body text-center p-5">
                <i className="fa-solid fa-headset text-primary display-3 mb-3"></i>
                <h3>Need Help?</h3>
                <p>Our travel experts are available 24/7 to assist you.</p>
                <Link to="/contact" className="btn btn-primary">
                  Contact Support
                </Link>
              </div>
            </div>

            <div className="card border-0 shadow-lg mt-4">
              <div className="card-body text-center">
                <i className="fa-solid fa-phone text-success display-5 mb-3"></i>
                <h5>Call Us</h5>
                <p>+91 98765 43210</p>
                <hr />
                <i className="fa-solid fa-envelope text-danger display-5 mb-3"></i>
                <h5>Email</h5>
                <p>support@wanderly.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-1">© 2026 Wanderly Travel. All Rights Reserved.</p>
          <p className="text-center mb-0">
            Designed &amp; Developed by <strong>Dheebash V N</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
