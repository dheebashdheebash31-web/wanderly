import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { asset } from "../utils/asset";

const POPULAR = [
  { name: "Bali, Indonesia", image: asset("images/bali.jpg"), price: "From $499" },
  { name: "Santorini, Greece", image: asset("images/greece.jpg"), price: "From $699" },
  { name: "Switzerland", image: asset("images/switzerland.jpg"), price: "From $699" },
  { name: "Tokyo, Japan", image: asset("images/tokyo.jpg"), price: "From $799" },
];

const WHY_US = [
  { icon: "fa-tags", title: "Best Prices", text: "We offer competitive pricing with no hidden charges, ensuring you get the best value for every trip." },
  { icon: "fa-award", title: "Trusted Service", text: "Our experienced travel experts provide 24/7 customer support before and during your journey." },
  { icon: "fa-hotel", title: "Handpicked Hotels", text: "Stay in carefully selected hotels known for comfort, quality, and excellent hospitality." },
  { icon: "fa-globe", title: "Worldwide Destinations", text: "Explore beaches, mountains, cities, and cultural landmarks across the world with our exclusive packages." },
  { icon: "fa-plane-departure", title: "Easy Booking", text: "Book your dream vacation in just a few clicks with our simple and secure booking process." },
  { icon: "fa-heart", title: "Memorable Experiences", text: "We create personalized travel experiences that leave unforgettable memories for every traveler." },
];

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const location = form.get("location") || "";
    navigate(`/explore?location=${encodeURIComponent(location)}`);
  };

  return (
    <>
      <Header />

      <section className="hero" style={{ backgroundImage: `url(${asset("images/hero.jpg")})` }}>
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>
            Explore The <br />
            Beauty of The World
          </h1>
          <p>Discover amazing places at exclusive deals and make your journey unforgettable.</p>
          <div className="hero-buttons">
            <a href="/explore" className="primary" onClick={(e) => { e.preventDefault(); navigate("/explore"); }}>
              Explore Now
            </a>
            <a href="/about" className="secondary" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section className="search-box">
        <form className="search-card" onSubmit={handleSearch}>
          <div className="field">
            <label>
              <i className="fa-solid fa-location-dot"></i> Location
            </label>
            <input type="text" name="location" placeholder="Where are you Going?" required />
          </div>
          <div className="field">
            <label>
              <i className="fa-solid fa-calendar"></i> Check In
            </label>
            <input type="date" name="checkin" required />
          </div>
          <div className="field">
            <label>
              <i className="fa-solid fa-calendar-check"></i> Check Out
            </label>
            <input type="date" name="checkout" required />
          </div>
          <div className="field">
            <label>
              <i className="fa-solid fa-user-group"></i> Guests
            </label>
            <input type="number" name="guests" min="1" required />
          </div>
          <button type="submit" className="search-btn">
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>
        </form>
      </section>

      <section className="explore-section">
        <div className="section-title">
          <h2 className="text-center mb-0">Explore Destinations</h2>
          <a href="/explore" onClick={(e) => { e.preventDefault(); navigate("/explore"); }}>
            View All
          </a>
        </div>

        <div className="explore-grid">
          {POPULAR.map((place) => (
            <div className="explore-card" key={place.name}>
              <img src={place.image} alt={place.name} />
              <div className="card-content">
                <h3>{place.name}</h3>
                <p>{place.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="why-us">
        <div className="container">
          <h2>Why Travel With Us?</h2>
          <p className="text-center mb-5">
            Discover why thousands of travelers choose Wanderly for unforgettable adventures.
          </p>
          <div className="why-grid">
            {WHY_US.map((card) => (
              <div className="why-card" key={card.title}>
                <i className={`fas ${card.icon}`}></i>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
