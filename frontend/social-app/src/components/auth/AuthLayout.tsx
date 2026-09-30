import type { ReactNode } from "react";
import "./AuthLayout.css";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <section className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">Pulse</div>

          <h1 className="auth-brand-title">
            Connect.
            <br />
            Share.
            <br />
            Discover.
          </h1>

          <p className="auth-brand-description">
            A simple place to connect with people, share what matters to you,
            and discover something new.
          </p>
        </div>
      </section>

      <main className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-logo">Pulse</div>

          <div className="auth-heading">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
