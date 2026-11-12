import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="py-5 text-center" style={{ padding: "6rem 1rem" }}>
        <h1 className="fw-bold">404</h1>
        <p className="lead">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          Back Home
        </Link>
      </section>
      <Footer />
    </>
  );
}
