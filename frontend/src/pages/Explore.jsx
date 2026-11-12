import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as api from "../api/wanderly";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { asset } from "../utils/asset";
import "../styles/explore_style.css";

// Only a handful of destinations ship with a dedicated photo; anything
// else (added later via the admin) falls back to the hero image.
const IMAGE_BY_SLUG = {
  goa: asset("images/goa.jpg"),
  dubai: asset("images/dubai.jpg"),
};
const FALLBACK_IMAGE = asset("images/hero.jpg");

const FILTERS = [
  { key: "all", label: "All" },
  { key: "beach", label: "Beach" },
  { key: "mountain", label: "Mountains" },
  { key: "city", label: "City" },
  { key: "nature", label: "Nature" },
  { key: "adventure", label: "Adventure" },
];

export default function Explore() {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("location") || searchParams.get("destination") || "";
  const [filter, setFilter] = useState("all");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const { user } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getDestinations(destination ? { location: destination } : {})
      .then((data) => {
        if (!cancelled) setDestinations(data);
      })
      .catch(() => {
        if (!cancelled) setDestinations([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [destination]);

  const visible = useMemo(() => {
    return destinations.filter((place) => filter === "all" || place.category === filter);
  }, [destinations, filter]);

  const handleAddToCart = async (place) => {
    if (!user) {
      showToast("Please log in to add a destination to your cart", "error");
      navigate("/login");
      return;
    }
    setAddingId(place.id);
    try {
      await addItem(place.id, 1);
      showToast(`${place.name} added to your cart`);
    } catch (err) {
      showToast(err.message || "Couldn't add to cart", "error");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <Header />

      <section className="hero">
        <h1 className="text-center mb-0">Explore Amazing Destinations</h1>
        <p className="text-center mb-0">Find your perfect vacation destination and start your next adventure today.</p>
      </section>

      <section className="explore">
        <h2 className="text-center mb-0">Choose Your Destination</h2>
        <div className="line"></div>

        <div className="filter-buttons">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={filter === f.key ? "active" : ""}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center">Loading destinations…</p>
        ) : visible.length === 0 ? (
          <p className="text-center">No destinations match that search.</p>
        ) : (
          <div className="destination-grid">
            {visible.map((place) => (
              <div className="card" key={place.id ?? place.slug}>
                <img src={IMAGE_BY_SLUG[place.slug] || FALLBACK_IMAGE} alt={place.name} />
                <div className="card-content">
                  <h3>{place.name}</h3>
                  <p>{place.price}</p>
                  <button
                    type="button"
                    className="add-to-cart-btn"
                    disabled={addingId === place.id}
                    onClick={() => handleAddToCart(place)}
                  >
                    {addingId === place.id ? "Adding…" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
