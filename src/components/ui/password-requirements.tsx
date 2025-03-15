'use client';

import { Check, X } from 'lucide-react';
import type { PasswordRequirementsProps } from '@/types/ui';

export function PasswordRequirements({
  validation,
}: PasswordRequirementsProps) {
  const requirements = [
    { label: 'At least 8 characters', met: validation.hasMinLength },
    {
      label: 'At least one uppercase letter',
      met: validation.hasUppercase,
    },
    {
      label: 'At least one lowercase letter',
      met: validation.hasLowercase,
    },
    { label: 'At least one number', met: validation.hasNumber },
    {
      label: 'At least one special character',
      met: validation.hasSpecialChar,
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">
        Password requirements:
      </p>
      <ul className="text-sm space-y-1">
        {requirements.map(({ label, met }) => (
          <li key={label} className="flex items-center gap-2">
            {met ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-destructive" />
            )}
            <span
              className={met ? 'text-green-500' : 'text-destructive'}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
