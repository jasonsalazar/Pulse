import { Card } from "../ui";

import "./RightSidebar.css";

export default function RightSidebar() {
  return (
    <aside className="right-sidebar">
      <Card>
        <h2 className="right-sidebar-title">Suggested for you</h2>

        <p className="right-sidebar-placeholder">
          Suggested users will appear here.
        </p>
      </Card>

      <Card>
        <h2 className="right-sidebar-title">Trending</h2>

        <p className="right-sidebar-placeholder">
          Trending topics will appear here.
        </p>
      </Card>
    </aside>
  );
}
