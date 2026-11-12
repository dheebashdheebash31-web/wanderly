import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function BootstrapNavbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-2 text-primary" to="/">
          <i className="fa-solid fa-plane"></i> Wanderly
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/explore">
                Explore
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/contact">
                Contact
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/my-bookings">
                  My Bookings
                </NavLink>
              </li>
            )}
          </ul>

          {user && (
            <Link to="/cart" className="btn btn-outline-primary px-3 py-2 rounded-3 me-2 position-relative">
              <i className="fa-solid fa-cart-shopping"></i>
              {cart && cart.total_items > 0 && (
                <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                  {cart.total_items}
                </span>
              )}
            </Link>
          )}

          {user?.is_staff && (
            <Link to="/admin-panel" className="btn btn-outline-primary px-3 py-2 rounded-3 me-2">
              Admin Panel
            </Link>
          )}
          {user ? (
            <button type="button" className="btn btn-primary px-4 py-2 rounded-3" onClick={logout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary px-4 py-2 rounded-3">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
