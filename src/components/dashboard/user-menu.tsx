'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronDown } from 'lucide-react';
import type { AuthError } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';
import { Avatar } from '@/components/ui/avatar';

interface UserMenuProps {
  user: User;
  profile: Profile | null;
  onSignOut: () => Promise<{ error: AuthError | null }>;
}

export function UserMenu({
  user,
  profile,
  onSignOut,
}: UserMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await onSignOut();
    if (!error) {
      router.push('/login');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-muted-foreground">
        {user.user_metadata.display_name || user.email}
      </span>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 hover:bg-muted"
          >
            <Avatar user={user} profile={profile} size="sm" />
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            {user.email}
          </div>
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false);
              router.push('/dashboard/profile');
            }}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
