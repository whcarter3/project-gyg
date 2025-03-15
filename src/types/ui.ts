export type ThemeAttribute = 'class' | 'data-theme' | 'data-mode';

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: ThemeAttribute;
}

export interface PasswordRequirementsProps {
  validation: PasswordValidation;
}

export interface PasswordValidation {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}
