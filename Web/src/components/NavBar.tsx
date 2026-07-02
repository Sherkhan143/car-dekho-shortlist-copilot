import { NavLink } from "react-router-dom";
import { useShortlist } from "../context/shortlist-context";

export function NavBar() {
  const { items } = useShortlist();

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand">
        CarDekho <span>Shortlist Copilot</span>
      </NavLink>
      <nav className="navbar__links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/recommended">Recommended Cars</NavLink>
        <NavLink to="/shortlist">
          My Shortlist
          {items.length > 0 && (
            <span className="navbar__badge">{items.length}</span>
          )}
        </NavLink>
      </nav>
    </header>
  );
}
