import { Link } from "react-router-dom";

import { Button, Card } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.75rem",
            }}
          >
            Home
          </h1>

          <p
            style={{
              margin: "0.25rem 0 0",
              color: "var(--color-text-secondary)",
            }}
          >
            Welcome back, {user?.username}.
          </p>
        </div>

        <Button variant="ghost" onClick={logout}>
          Logout
        </Button>
      </div>

      <Card>
        <h2
          style={{
            marginTop: 0,
          }}
        >
          Your feed
        </h2>

        <p
          style={{
            color: "var(--color-text-secondary)",
          }}
        >
          Your posts and posts from people you follow will appear here.
        </p>

        <Link to="/profile">
          <Button>View Profile</Button>
        </Link>
      </Card>
    </div>
  );
}
