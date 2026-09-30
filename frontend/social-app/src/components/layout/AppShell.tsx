import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import MobileNavigation from "./MobileNavigation";

import "./AppShell.css";

export default function AppShell() {
  return (
    <div className="app-shell">
      <Header />

      <div className="app-shell-layout">
        <Sidebar />

        <main className="app-main">
          <Outlet />
        </main>

        <RightSidebar />
      </div>

      <MobileNavigation />
    </div>
  );
}
