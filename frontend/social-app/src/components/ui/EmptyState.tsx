import type { ReactNode } from "react";

import "./EmptyState.css";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="ui-empty-state">
      <h2>{title}</h2>

      {description && <p>{description}</p>}

      {action && <div className="ui-empty-state-action">{action}</div>}
    </div>
  );
}
