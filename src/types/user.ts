/**
 * User profile information stored in localStorage
 */
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  role?: string;
  createdAt?: string;
}

/**
 * Password change form data
 */
export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password validation requirement
 */
export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

/**
 * Password strength levels
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong';
