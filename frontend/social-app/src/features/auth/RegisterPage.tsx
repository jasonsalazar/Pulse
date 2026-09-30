import { type SubmitEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "../../components/auth";
import { Button, ErrorMessage, Input } from "../../components/ui";

import { useAuth } from "../../context/AuthContext";

import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Pulse and start connecting."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}

        <Input
          id="username"
          name="username"
          type="text"
          label="Username"
          placeholder="Choose a username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isSubmitting}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
        />

        <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span>

        <Link to="/login" className="auth-link">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
