import { NavLink } from "react-router-dom";

import "./MobileNavigation.css";

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
    label: "Profile",
    path: "/profile",
    icon: "○",
  },
];

export default function MobileNavigation() {
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
        </NavLink>
      ))}
    </nav>
  );
}
