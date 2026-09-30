export interface PasswordRequirements {
  minimumLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialCharacter: boolean;
}

export function getPasswordRequirements(
  password: string,
): PasswordRequirements {
  return {
    minimumLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    specialCharacter: /[^A-Za-z0-9\s]/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const requirements = getPasswordRequirements(password);

  return Object.values(requirements).every(Boolean);
}
