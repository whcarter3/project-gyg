'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  User,
  Settings,
  BarChart,
  Activity,
} from 'lucide-react';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Profile',
    icon: User,
    href: '/dashboard/profile',
    color: 'text-violet-500',
  },
  {
    label: 'Activity',
    icon: Activity,
    color: 'text-pink-700',
    href: '/dashboard/activity',
  },
  {
    label: 'Analytics',
    icon: BarChart,
    color: 'text-orange-700',
    href: '/dashboard/analytics',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card text-card-foreground">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition',
                pathname === route.href
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground'
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon
                  className={cn('h-5 w-5 mr-3', route.color)}
                />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
