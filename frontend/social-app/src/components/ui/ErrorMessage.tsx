import "./ErrorMessage.css";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="ui-error-message" role="alert">
      {message}
    </div>
  );
}
