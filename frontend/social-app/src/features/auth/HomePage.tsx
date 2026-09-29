import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>SocialApp</h1>

      <h2>Welcome, {user?.username}!</h2>

      <p>Email: {user?.email}</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
