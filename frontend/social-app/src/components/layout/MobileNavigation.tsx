import { NavLink } from "react-router-dom";

import "./MobileNavigation.css";
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

export default function MobileNavigation() {
  const { totalUnreadCount } = useMessaging();

  return (
    <nav className="mobile-navigation">
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `mobile-navigation-link ${
              isActive ? "mobile-navigation-link-active" : ""
            }`
          }
        >
          <span className="mobile-navigation-icon">{item.icon}</span>

          <span>{item.label}</span>

          {item.label === "Messages" && totalUnreadCount > 0 && (
            <span className="mobile-nav-badge">
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
