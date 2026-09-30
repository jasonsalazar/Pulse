import { getPasswordRequirements } from "../../features/auth/passwordValidation";

import "./PasswordRequirements.css";

interface PasswordRequirementsProps {
  password: string;
}

interface RequirementProps {
  valid: boolean;
  children: React.ReactNode;
}

function Requirement({ valid, children }: RequirementProps) {
  return (
    <li
      className={`password-requirement ${
        valid ? "password-requirement-valid" : ""
      }`}
    >
      <span className="password-requirement-icon" aria-hidden="true">
        {valid ? "✓" : "○"}
      </span>

      <span>{children}</span>
    </li>
  );
}

export default function PasswordRequirements({
  password,
}: PasswordRequirementsProps) {
  const requirements = getPasswordRequirements(password);

  return (
    <div className="password-requirements">
      <p className="password-requirements-title">Password requirements</p>

      <ul className="password-requirements-list">
        <Requirement valid={requirements.minimumLength}>
          At least 8 characters
        </Requirement>

        <Requirement valid={requirements.uppercase}>
          One uppercase letter
        </Requirement>

        <Requirement valid={requirements.lowercase}>
          One lowercase letter
        </Requirement>

        <Requirement valid={requirements.number}>One number</Requirement>

        <Requirement valid={requirements.specialCharacter}>
          One special character (e.g., !@#$%^&*)
        </Requirement>
      </ul>
    </div>
  );
}
