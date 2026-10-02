import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";
import { NotificationBell } from "../notifications";

import "./Header.css";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/home" className="app-header__brand">
          <span className="app-header__logo">P</span>

          <span className="app-header__name">Pulse</span>
        </Link>

        <div className="app-header__actions">
          <NotificationBell />

          {user && (
            <Link
              to="/profile"
              className="app-header__profile"
              aria-label="View your profile"
            >
              <Avatar alt={user.username} size="sm" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
