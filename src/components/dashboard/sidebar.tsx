'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User as UserIcon,
  LogOut,
  Trophy,
  Users,
  Menu,
  X,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { AuthError } from '@supabase/supabase-js';

interface SidebarProps {
  user: User;
  onSignOut: () => Promise<{ error: AuthError | null }>;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  user,
  onSignOut,
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const result = await onSignOut();
    if (result.error) {
      console.error('Error signing out:', result.error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => (isOpen ? onClose() : onClose())}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground lg:hidden"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 top-0 h-screen w-full lg:w-72 bg-primary flex flex-col z-40
        transform transition-transform duration-200 ease-in-out
        ${
          isOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }
      `}
      >
        <div className="p-6">
          <h1 className="text-2xl pl-12 lg:pl-0 font-bold text-primary-foreground">
            Get Your Guys
          </h1>
        </div>
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-white text-primary'
                    : 'text-primary-foreground hover:bg-white/10'
                }`}
                onClick={onClose}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/leagues"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/leagues'
                    ? 'bg-white text-primary'
                    : 'text-primary-foreground hover:bg-white/10'
                }`}
                onClick={onClose}
              >
                <Trophy className="h-5 w-5" />
                <span>Leagues</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/players"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/players'
                    ? 'bg-white text-primary'
                    : 'text-primary-foreground hover:bg-white/10'
                }`}
                onClick={onClose}
              >
                <Users className="h-5 w-5" />
                <span>Players</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  pathname === '/dashboard/profile'
                    ? 'bg-white text-primary'
                    : 'text-primary-foreground hover:bg-white/10'
                }`}
                onClick={onClose}
              >
                <UserIcon className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 px-4 py-2 text-primary-foreground">
            <UserIcon className="h-5 w-5" />
            <span className="text-sm">{user.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-2 text-primary-foreground hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
