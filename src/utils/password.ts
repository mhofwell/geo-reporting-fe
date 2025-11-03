import type { PasswordStrength, PasswordRequirement } from '@/types/user';

/**
 * Password validation requirements
 */
export const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: 'Contains lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: 'Contains number',
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    label: 'Contains special character',
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
];

/**
 * Calculate password strength based on requirements met
 */
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return 'weak';
  }

  const metRequirements = passwordRequirements.filter((req) => req.test(password)).length;

  if (metRequirements <= 2) {
    return 'weak';
  } else if (metRequirements <= 4) {
    return 'medium';
  } else {
    return 'strong';
  }
};

/**
 * Check if password meets all requirements
 */
export const isPasswordValid = (password: string): boolean => {
  return passwordRequirements.every((req) => req.test(password));
};

/**
 * Get password strength color for UI display
 */
export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'strong':
      return 'text-green-500';
    default:
      return 'text-muted-foreground';
  }
};

/**
 * Get password strength progress value (0-100)
 */
export const getPasswordStrengthProgress = (strength: PasswordStrength): number => {
  switch (strength) {
    case 'weak':
      return 33;
    case 'medium':
      return 66;
    case 'strong':
      return 100;
    default:
      return 0;
  }
};
