import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as api from "../api/wanderly";
import "../styles/cart_style.css";
import "../styles/bookings_style.css";

const STATUS_LABEL = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};

export default function MyBookings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const justBookedId = location.state?.justBookedId;

  useEffect(() => {
    api
      .getOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />

      <section className="cart-hero">
        <h1 className="text-center mb-0">My Bookings</h1>
        <p className="text-center mb-0">A history of every trip you've booked with Wanderly.</p>
      </section>

      <section className="cart-section">
        {loading ? (
          <p className="text-center">Loading your bookings…</p>
        ) : orders.length === 0 ? (
          <div className="cart-empty">
            <p>You haven't booked any trips yet.</p>
            <Link to="/explore" className="browse-btn">
              Browse Destinations
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {orders.map((order) => (
              <div className={`booking-card${order.id === justBookedId ? " booking-just-placed" : ""}`} key={order.id}>
                <div className="booking-card-header">
                  <div>
                    <h3>Booking #{order.id}</h3>
                    <p>Travel date: {order.travel_date}</p>
                  </div>
                  <span className={`booking-status booking-status-${order.status.toLowerCase()}`}>
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>

                <ul className="booking-item-list">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.destination_name} × {item.quantity}
                      <span>₹{item.subtotal}</span>
                    </li>
                  ))}
                </ul>

                <div className="booking-card-footer">
                  <span>Contact: {order.phone}</span>
                  <span className="booking-total">Total: ₹{order.total_amount}</span>
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
