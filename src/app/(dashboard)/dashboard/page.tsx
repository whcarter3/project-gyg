'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <p className="text-primary">Welcome back, {user?.email}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Tasks</div>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Completed</div>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">In Progress</div>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Pending</div>
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <p className="text-sm text-primary">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
