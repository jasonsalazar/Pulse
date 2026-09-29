import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>SocialApp</h1>

      <h2>Welcome, {user?.username}!</h2>

      <p>Email: {user?.email}</p>

      <p>
        <Link to="/profile">My Profile</Link>
      </p>

      <p>
        <Link to="/profile/edit">Edit Profile</Link>
      </p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
