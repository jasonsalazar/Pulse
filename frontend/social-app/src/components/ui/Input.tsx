import type { InputHTMLAttributes } from "react";

import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
  return (
    <div className="ui-input-container">
      {label && (
        <label className="ui-input-label" htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        className={`ui-input ${error ? "ui-input-error" : ""}`}
        {...props}
      />

      {error && <span className="ui-input-error-text">{error}</span>}
    </div>
  );
}
