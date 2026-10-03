import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";
import { useMessaging } from "../../context/MessagingContext";

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    path: "/home",
    icon: "⌂",
  },
  {
    label: "Explore",
    path: "/explore",
    icon: "⌕",
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: "♡",
  },
  {
    label: "Messages",
    path: "/messages",
    icon: "✉",
  },
  {
    label: "Profile",
    path: "/profile",
    icon: "○",
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { totalUnreadCount } = useMessaging();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="app-sidebar">
      <nav className="app-sidebar-nav">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>

            <span>{item.label}</span>

            {item.label === "Messages" && totalUnreadCount > 0 && (
              <span className="nav-badge">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="app-sidebar-bottom">
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-link-icon">↪</span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
