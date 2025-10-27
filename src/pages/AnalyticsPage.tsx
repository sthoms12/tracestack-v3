import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";
import { Session, SessionStatus, PriorityLevel } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const STATUS_COLORS: Record<SessionStatus, string> = {
  [SessionStatus.Active]: '#3b82f6',
  [SessionStatus.Resolved]: '#22c55e',
  [SessionStatus.Blocked]: '#f59e0b',
  [SessionStatus.Archived]: '#6b7280',
};
const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  [PriorityLevel.Low]: '#22c55e',
  [PriorityLevel.Medium]: '#3b82f6',
  [PriorityLevel.High]: '#f59e0b',
  [PriorityLevel.Critical]: '#ef4444',
};
export default function AnalyticsPage() {
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => api('/api/sessions'),
  });
  const analyticsData = useMemo(() => {
    if (!sessions) return null;
    const statusCounts = sessions.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {} as Record<SessionStatus, number>);
    const priorityCounts = sessions.reduce((acc, s) => {
      acc[s.priority] = (acc[s.priority] || 0) + 1;
      return acc;
    }, {} as Record<PriorityLevel, number>);
    const tagCounts = sessions.flatMap(s => s.tags).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count: value }));
    const priorityChartData = Object.entries(priorityCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    const tagChartData = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, count: value }));
    return { statusChartData, priorityChartData, tagChartData };
  }, [sessions]);
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Analytics</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Session Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData?.statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={analyticsData?.priorityChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {analyticsData?.priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name.toLowerCase() as PriorityLevel]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Top 10 Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analyticsData?.tagChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}