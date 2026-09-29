import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-brand">
        <span className="name">Featherlog</span>
        <span className="tag">a field record</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Gallery</NavLink>
        <NavLink to="/unidentified" className={({ isActive }) => (isActive ? "active" : "")}>No ID yet</NavLink>
      </div>
    </nav>
  );
}
