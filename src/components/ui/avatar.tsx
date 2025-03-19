import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';

interface AvatarProps {
  user: User;
  profile: Profile | null;
  size?: 'sm' | 'md' | 'lg';
  showUploadButton?: boolean;
  onUpload?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  isUploading?: boolean;
}

export function Avatar({
  user,
  profile,
  size = 'md',
  showUploadButton = false,
  onUpload,
  isUploading = false,
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-32 h-32',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const initials = (user.user_metadata.display_name || user.email)
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative">
      {profile?.avatar_url ? (
        <Image
          src={profile.avatar_url}
          alt={user.user_metadata.display_name || 'Profile picture'}
          width={size === 'lg' ? 128 : size === 'md' ? 48 : 32}
          height={size === 'lg' ? 128 : size === 'md' ? 48 : 32}
          className={`rounded-full ${sizeClasses[size]}`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-muted flex items-center justify-center`}
        >
          <span
            className={`font-bold text-background ${textSizeClasses[size]}`}
          >
            {initials}
          </span>
        </div>
      )}
      {showUploadButton && (
        <div className="absolute bottom-0 right-0">
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer bg-primary rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-background"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
