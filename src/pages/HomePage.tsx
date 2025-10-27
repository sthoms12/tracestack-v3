import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Ban, CheckCircle, Loader2, LucideIcon, PlayCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Session, SessionStats, SessionStatus } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
import SessionCard from "@/components/sessions/SessionCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CreateSessionDialog from "@/components/sessions/CreateSessionDialog";
import { useState } from "react";
import { motion } from "framer-motion";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
const StatCard = ({ title, value, Icon, isLoading }: { title: string; value: number; Icon: LucideIcon; isLoading: boolean }) => (
  <motion.div variants={itemVariants}>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-1/2" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);
export function HomePage() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: stats, isLoading: isLoadingStats } = useQuery<SessionStats>({
    queryKey: ['sessionStats'],
    queryFn: () => api('/api/sessions/stats'),
  });
  const { data: sessions, isLoading: isLoadingSessions } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => api('/api/sessions'),
  });
  const recentSessions = sessions?.slice(0, 5) ?? [];
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <CreateSessionDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
              <Button onClick={() => setCreateDialogOpen(true)}>New Session</Button>
            </CreateSessionDialog>
          </div>
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <StatCard title="Active" value={stats?.active ?? 0} Icon={PlayCircle} isLoading={isLoadingStats} />
            <StatCard title="Resolved" value={stats?.resolved ?? 0} Icon={CheckCircle} isLoading={isLoadingStats} />
            <StatCard title="Blocked" value={stats?.blocked ?? 0} Icon={Ban} isLoading={isLoadingStats} />
            <StatCard title="Archived" value={stats?.archived ?? 0} Icon={Archive} isLoading={isLoadingStats} />
          </motion.div>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold tracking-tight">Recent Sessions</h2>
                <Button variant="link" asChild>
                  <Link to="/app/sessions">View All</Link>
                </Button>
              </div>
              {isLoadingSessions ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
                </div>
              ) : recentSessions.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {recentSessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No recent sessions. Start a new one!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}