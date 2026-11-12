import { Link } from "react-router-dom";
import BootstrapNavbar from "./BootstrapNavbar";

export default function LegalPage({ icon, title, lead, sections }) {
  return (
    <div className="wanderly-legal-page">
      <BootstrapNavbar />

      <section className="bg-dark text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">
            <i className={`fa-solid ${icon}`}></i> {title}
          </h1>
          <p className="lead">{lead}</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="card shadow border-0">
            <div className="card-body p-5">
              {sections.map((section, i) => (
                <div key={section.heading}>
                  <h3 className="text-primary">
                    <i className={`fa-solid ${section.icon}`}></i> {section.heading}
                  </h3>

                  {section.paragraph && <p>{section.paragraph}</p>}

                  {section.list && (
                    <ul className="list-group list-group-flush mb-4">
                      {section.list.map((item) => (
                        <li className="list-group-item" key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {i < sections.length - 1 && !section.list && <hr />}
                </div>
              ))}

              <div className="text-center mt-5">
                <Link to="/contact" className="btn btn-primary me-2">
                  Contact Us
                </Link>
                <Link to="/" className="btn btn-outline-dark">
                  Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white text-center py-4">
        <div className="container">
          <p className="mb-0">© 2026 Wanderly Travel. All Rights Reserved.</p>
          <p className="text-center mb-0">
            Designed &amp; Developed by <strong>Dheebash V N</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
