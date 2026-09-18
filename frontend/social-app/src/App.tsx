import { useEffect, useState } from "react";
import { getHealth } from "./api";

type HealthResponse = {
  status: string;
  service: string;
};

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => setError("Could not connect to API"));
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>SocialApp</h1>

      {health && (
        <p>
          🟢 {health.service} — {health.status}
        </p>
      )}

      {error && <p>🔴 {error}</p>}
    </main>
  );
}

export default App;
