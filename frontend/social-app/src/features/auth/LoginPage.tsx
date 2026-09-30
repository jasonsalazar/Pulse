import { type SubmitEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "../../components/auth";
import { Button, ErrorMessage, Input } from "../../components/ui";

import { useAuth } from "../../context/AuthContext";

import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await login({ email: email.trim(), password });

      navigate("/home");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to Pulse.">
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}

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
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
        />

        <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="auth-footer">
        <span>Don't have an account?</span>

        <Link to="/register" className="auth-link">
          Create one
        </Link>
      </div>
    </AuthLayout>
  );
}
