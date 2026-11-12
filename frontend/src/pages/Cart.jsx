import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "../styles/cart_style.css";

export default function Cart() {
  const { cart, loading, updateItem, removeItem, placeOrder } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ phone: "", travel_date: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const items = cart?.items ?? [];

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateItem(itemId, quantity);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      showToast("Removed from cart");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCheckout = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      const order = await placeOrder(form);
      showToast("Booking confirmed!");
      navigate("/my-bookings", { state: { justBookedId: order.id } });
    } catch (err) {
      if (err.data && typeof err.data === "object") setErrors(err.data);
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <section className="cart-hero">
        <h1 className="text-center mb-0">Your Cart</h1>
        <p className="text-center mb-0">Review your selected destinations before booking.</p>
      </section>

      <section className="cart-section">
        {loading ? (
          <p className="text-center">Loading your cart…</p>
        ) : items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link to="/explore" className="browse-btn">
              Browse Destinations
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <h3>{item.destination.name}</h3>
                    <p>{item.destination.price} per traveler</p>
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className="cart-item-subtotal">₹{item.subtotal}</div>
                  <button className="cart-item-remove" onClick={() => handleRemove(item.id)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Booking Details</h2>
              <div className="cart-total-row">
                <span>Travelers</span>
                <span>{cart.total_items}</span>
              </div>
              <div className="cart-total-row cart-total-main">
                <span>Total</span>
                <span>₹{cart.total_price}</span>
              </div>

              <form onSubmit={handleCheckout}>
                <label htmlFor="phone">Contact phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  required
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="field-error">{errors.phone[0]}</span>}

                <label htmlFor="travel_date">Travel date</label>
                <input
                  id="travel_date"
                  name="travel_date"
                  type="date"
                  required
                  value={form.travel_date}
                  onChange={handleChange}
                />
                {errors.travel_date && <span className="field-error">{errors.travel_date[0]}</span>}

                <button type="submit" className="checkout-btn" disabled={submitting}>
                  {submitting ? "Booking…" : "Confirm Booking"}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
