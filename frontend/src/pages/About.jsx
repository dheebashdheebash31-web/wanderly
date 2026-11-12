import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { asset } from "../utils/asset";
import "../styles/about_style.css";

const VALUES = [
  { icon: "fa-handshake", title: "Trust", text: "Building long-lasting relationships through honesty, transparency, and exceptional customer service." },
  { icon: "fa-star", title: "Quality", text: "Providing premium travel experiences with carefully selected destinations and trusted partners." },
  { icon: "fa-earth-asia", title: "Adventure", text: "Helping travelers discover beautiful places, new cultures, and unforgettable adventures." },
];

const STATS = [
  { value: "10K+", label: "Happy Travelers" },
  { value: "250+", label: "Destinations" },
  { value: "500+", label: "Tour Packages" },
  { value: "24/7", label: "Customer Support" },
];

const WHY_US = [
  { icon: "fa-tags", title: "Affordable Packages", text: "Get the best travel deals without compromising on quality." },
  { icon: "fa-hotel", title: "Luxury Hotels", text: "Stay at top-rated hotels selected for comfort and quality." },
  { icon: "fa-headset", title: "24/7 Support", text: "Our travel experts are always available to assist you." },
  { icon: "fa-plane-departure", title: "Easy Booking", text: "Book your dream vacation in just a few simple steps." },
];

const TEAM = [
  { image: asset("images/team1.jpg"), name: "John Smith", role: "Travel Consultant", text: "Helping travelers discover the world's most amazing destinations." },
  { image: asset("images/team2.jpg"), name: "Emma Watson", role: "Tour Manager", text: "Planning unforgettable travel experiences with passion and care." },
  { image: asset("images/team3.jpg"), name: "David Miller", role: "Customer Support", text: "Available 24/7 to ensure your journey is smooth and memorable." },
];

const TESTIMONIAL_SLIDES = [
  [
    { quote: "Wanderly made our honeymoon unforgettable.", name: "Sophia" },
    { quote: "Excellent customer support and affordable packages.", name: "James" },
    { quote: "Amazing family vacation to Switzerland.", name: "Olivia" },
  ],
  [
    { quote: "Best travel company I've ever used.", name: "Daniel" },
    { quote: "Everything was perfectly planned.", name: "Emma" },
    { quote: "Highly recommended for every traveler.", name: "Michael" },
  ],
];

export default function About() {
  return (
    <>
      <Header />

      <section className="about-hero">
        <div className="container text-center">
          <h1>About Wanderly</h1>
          <p>Explore the world with confidence, comfort, and unforgettable memories.</p>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="about-image">
                <img src={asset("images/about.jpg")} className="img-fluid" alt="About Wanderly" />
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="fw-bold">Who We Are</h2>
              <div className="blue-line mb-4"></div>
              <p>
                Wanderly is a modern travel platform dedicated to helping people discover the
                world's most beautiful destinations. Whether you're planning a relaxing beach
                vacation, an adventurous mountain trek, or a cultural city tour, we make travel
                planning easy and enjoyable.
              </p>
              <p>
                Our experienced travel team works with trusted hotels, airlines, and local guides
                to deliver safe, affordable, and unforgettable travel experiences.
              </p>
              <p>At Wanderly, every journey begins with a dream, and we're here to turn that dream into reality.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100 p-4">
                <i className="fa-solid fa-bullseye fa-3x text-primary mb-3"></i>
                <h3>Our Mission</h3>
                <p>
                  Our mission is to make travel simple, affordable, and memorable by connecting
                  travelers with the best destinations, hotels, and experiences around the world.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow h-100 p-4">
                <i className="fa-solid fa-eye fa-3x text-primary mb-3"></i>
                <h3>Our Vision</h3>
                <p>
                  To become one of the world's most trusted travel platforms, inspiring people to
                  explore new places and create unforgettable memories with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Our Core Values</h2>
          <div className="row g-4">
            {VALUES.map((v) => (
              <div className="col-md-4" key={v.title}>
                <div className="card border-0 shadow h-100 p-4">
                  <i className={`fa-solid ${v.icon} fa-3x text-primary mb-3`}></i>
                  <h4>{v.title}</h4>
                  <p>{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section py-5">
        <div className="container">
          <div className="row text-center g-4">
            {STATS.map((s) => (
              <div className="col-md-3" key={s.label}>
                <h1 className="text-primary fw-bold">{s.value}</h1>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-us py-5 bg-light">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Why Choose Wanderly?</h2>
          <div className="row g-4">
            {WHY_US.map((w) => (
              <div className="col-lg-3 col-md-6" key={w.title}>
                <div className="card border-0 shadow h-100 text-center p-4">
                  <i className={`fa-solid ${w.icon} fa-3x text-primary mb-3`}></i>
                  <h4>{w.title}</h4>
                  <p>{w.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Meet Our Team</h2>
          <div className="row g-4">
            {TEAM.map((member, i) => (
              <div
                className={i === TEAM.length - 1 ? "col-lg-4 col-md-6 mx-auto" : "col-lg-4 col-md-6"}
                key={member.name}
              >
                <div className="card border-0 shadow text-center p-4">
                  <img
                    src={member.image}
                    className="rounded-circle mx-auto mb-3"
                    width="150"
                    height="150"
                    alt="Team Member"
                  />
                  <h4>{member.name}</h4>
                  <p className="text-primary">{member.role}</p>
                  <p>{member.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">What Our Travelers Say</h2>

          <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2500">
            <div className="carousel-inner">
              {TESTIMONIAL_SLIDES.map((slide, i) => (
                <div className={i === 0 ? "carousel-item active" : "carousel-item"} key={i}>
                  <div className="row g-4">
                    {slide.map((t) => (
                      <div className="col-md-4" key={t.name}>
                        <div className="card shadow border-0 h-100 p-4 text-center">
                          <i className="fas fa-quote-left fa-2x text-primary mb-3"></i>
                          <p>"{t.quote}"</p>
                          <h5>- {t.name}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="carousel-indicators mt-4">
              {TESTIMONIAL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#testimonialCarousel"
                  data-bs-slide-to={i}
                  className={i === 0 ? "active" : ""}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 text-center">
        <div className="container">
          <h2 className="fw-bold">Ready For Your Next Adventure?</h2>
          <p className="lead mb-4">Book your dream destination today and explore the world with Wanderly.</p>
          <Link to="/explore" className="btn btn-primary btn-lg me-3">
            Explore Destinations
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
