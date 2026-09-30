import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui";

import "./Header.css";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/home" className="app-logo">
          Pulse
        </Link>

        <div className="app-header-search">
          <input type="search" placeholder="Search" aria-label="Search" />
        </div>

        <Link
          to="/profile"
          className="app-header-profile"
          aria-label="My profile"
        >
          <Avatar size="sm" alt={user?.username ?? "User"} />
        </Link>
      </div>
    </header>
  );
}
