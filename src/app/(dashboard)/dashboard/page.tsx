'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <p className="text-primary">
        Welcome back,{' '}
        {user?.user_metadata.display_name || user?.email}
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent>
            <CardHeader>
              <div className="text-sm font-medium">Total Tasks</div>
            </CardHeader>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardHeader>
              <div className="text-sm font-medium">Completed</div>
            </CardHeader>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardHeader>
              <div className="text-sm font-medium">In Progress</div>
            </CardHeader>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardHeader>
              <div className="text-sm font-medium">Pending</div>
            </CardHeader>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <p className="text-sm text-primary">No recent activity</p>
        </CardContent>
      </Card>
    </div>
  );
}
