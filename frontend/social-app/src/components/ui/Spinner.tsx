import "./Spinner.css";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
}

export default function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <div
      className={`ui-spinner ui-spinner-${size}`}
      role="status"
      aria-label="Loading"
    />
  );
}
