import { type SubmitEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthLayout, PasswordRequirements } from "../../components/auth";

import { Button, ErrorMessage, Input } from "../../components/ui";

import { useAuth } from "../../context/AuthContext";

import { isPasswordValid } from "./passwordValidation";

import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError("Please meet all password requirements.");
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
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

        <div className="register-password-field">
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

          <PasswordRequirements password={password} />
        </div>

        <div className="confirm-password-field">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Enter your password again"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={isSubmitting}
          />

          {confirmPassword && password !== confirmPassword && (
            <span className="password-match-error">
              Passwords do not match.
            </span>
          )}
        </div>

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
