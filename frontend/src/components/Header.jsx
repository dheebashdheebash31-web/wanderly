import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { showToast } = useToast();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    showToast("Logged out");
  };

  return (
    <header>
      <div className="logo">
        <i className="fa-solid fa-plane"></i>
        <span>Wanderly</span>
      </div>

      <nav>
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/explore" className={({ isActive }) => (isActive ? "active" : "")}>
              Explore
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>
              Contact
            </NavLink>
          </li>
          {user?.is_staff && (
            <li>
              <NavLink to="/admin-panel" className={({ isActive }) => (isActive ? "active" : "")}>
                Admin Panel
              </NavLink>
            </li>
          )}
          {user && !user.is_staff && (
            <li>
              <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? "active" : "")}>
                My Bookings
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="header-actions">
        {user && !user.is_staff && (
          <Link to="/cart" className="cart-link">
            <i className="fa-solid fa-cart-shopping"></i>
            {cart && cart.total_items > 0 && <span className="cart-badge">{cart.total_items}</span>}
          </Link>
        )}
        {user ? (
          <a href="#logout" className="login-btn" onClick={handleLogout}>
            Logout{user.first_name ? ` (${user.first_name.split(" ")[0]})` : ""}
          </a>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
