'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import type { PasswordValidation } from '@/lib/utils/password-validation';

interface PasswordRequirementsProps {
  validation: PasswordValidation;
}

export function PasswordRequirements({
  validation,
}: PasswordRequirementsProps) {
  const requirements = [
    {
      label: 'At least 8 characters long',
      met: validation.requirements.minLength,
    },
    {
      label: 'Contains an uppercase letter',
      met: validation.requirements.hasUppercase,
    },
    {
      label: 'Contains a lowercase letter',
      met: validation.requirements.hasLowercase,
    },
    {
      label: 'Contains a number',
      met: validation.requirements.hasNumber,
    },
    {
      label: 'Contains a special character',
      met: validation.requirements.hasSpecialChar,
    },
  ];

  return (
    <div className="space-y-2 text-sm">
      <p className="font-medium text-muted-foreground">
        Password requirements:
      </p>
      <ul className="space-y-1">
        {requirements.map((requirement, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-muted-foreground"
          >
            {requirement.met ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            <span className={requirement.met ? 'text-green-500' : ''}>
              {requirement.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
