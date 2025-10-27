import { AppLayout } from "@/components/layout/AppLayout";
import SessionTimelineView from "@/components/sessions/SessionTimelineView";
import SessionKanbanView from "@/components/sessions/SessionKanbanView";
import SessionNotesView from "@/components/sessions/SessionNotesView";
import SessionBrainstormView from "@/components/sessions/SessionBrainstormView";
import SessionUnifiedView from "@/components/sessions/SessionUnifiedView";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api-client";
import { Session, SessionStatus, PriorityLevel } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { format } from 'date-fns';
import { Calendar, Clock, Hash, Shield, Tag, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import RcaReportDialog from "@/components/sessions/RcaReportDialog";
const statusIcons: Record<SessionStatus, string> = {
  [SessionStatus.Active]: "🔵",
  [SessionStatus.Resolved]: "🟢",
  [SessionStatus.Blocked]: "🟡",
  [SessionStatus.Archived]: "���️",
};
const priorityColors: Record<PriorityLevel, string> = {
  [PriorityLevel.Low]: "text-green-500",
  [PriorityLevel.Medium]: "text-blue-500",
  [PriorityLevel.High]: "text-yellow-500",
  [PriorityLevel.Critical]: "text-red-500",
};
export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [isRcaDialogOpen, setRcaDialogOpen] = useState(false);
  const { data: session, isLoading, error } = useQuery<Session>({
    queryKey: ['session', id],
    queryFn: () => api(`/api/sessions/${id}`),
    enabled: !!id,
  });
  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
  if (error || !session) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">Session not found</h2>
          <p className="text-muted-foreground mt-2">Could not load the requested session.</p>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <span>{statusIcons[session.status]}</span>
              {session.title}
            </h1>
            <p className="mt-2 text-muted-foreground">{session.description}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="notes">Raw Notes</TabsTrigger>
                  <TabsTrigger value="brainstorm">Brainstorm</TabsTrigger>
                  <TabsTrigger value="unified">Unified</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline" className="mt-6">
                  <SessionTimelineView session={session} />
                </TabsContent>
                <TabsContent value="kanban" className="mt-6">
                  <SessionKanbanView session={session} />
                </TabsContent>
                <TabsContent value="notes" className="mt-6">
                  <SessionNotesView session={session} />
                </TabsContent>
                <TabsContent value="brainstorm" className="mt-6">
                  <SessionBrainstormView session={session} />
                </TabsContent>
                <TabsContent value="unified" className="mt-6">
                  <SessionUnifiedView session={session} />
                </TabsContent>
              </Tabs>
            </div>
            <div className="space-y-6 lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-muted-foreground" /> Priority: <span className={`font-semibold capitalize ${priorityColors[session.priority]}`}>{session.priority}</span></div>
                  <div className="flex items-center gap-3"><Hash className="h-4 w-4 text-muted-foreground" /> Environment: <span className="font-semibold">{session.environment}</span></div>
                  <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /> Created: <span className="font-semibold">{format(new Date(session.createdAt), 'PPp')}</span></div>
                  <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /> Last Updated: <span className="font-semibold">{format(new Date(session.updatedAt), 'PPp')}</span></div>
                  <div className="flex items-start gap-3"><Tag className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      Tags:
                      <div className="flex flex-wrap gap-2 mt-1">
                        {session.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <RcaReportDialog open={isRcaDialogOpen} onOpenChange={setRcaDialogOpen} session={session}>
                <Button variant="outline" className="w-full" onClick={() => setRcaDialogOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate RCA Report
                </Button>
              </RcaReportDialog>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}