import type { TextareaHTMLAttributes } from "react";

import "./TextArea.css";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function TextArea({
  label,
  error,
  id,
  ...props
}: TextAreaProps) {
  return (
    <div className="ui-textarea-container">
      {label && (
        <label className="ui-textarea-label" htmlFor={id}>
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={`ui-textarea ${error ? "ui-textarea-error" : ""}`}
        {...props}
      />

      {error && <span className="ui-textarea-error-text">{error}</span>}
    </div>
  );
}
