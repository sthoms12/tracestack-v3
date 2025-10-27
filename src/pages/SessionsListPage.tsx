import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api-client";
import { Session, SessionStatus, PriorityLevel } from "@shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import CreateSessionDialog from "@/components/sessions/CreateSessionDialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const statusColors: Record<SessionStatus, string> = {
  [SessionStatus.Active]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  [SessionStatus.Resolved]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  [SessionStatus.Blocked]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  [SessionStatus.Archived]: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
};
const priorityColors: Record<PriorityLevel, string> = {
  [PriorityLevel.Low]: "border-green-500",
  [PriorityLevel.Medium]: "border-blue-500",
  [PriorityLevel.High]: "border-yellow-500",
  [PriorityLevel.Critical]: "border-red-500"
};
export default function SessionsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: sessions, isLoading } = useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => api('/api/sessions')
  });
  const duplicateSessionMutation = useMutation({
    mutationFn: (sessionId: string) => api<Session>(`/api/sessions/${sessionId}/duplicate`, { method: 'POST' }),
    onSuccess: () => {
      toast.success("Session duplicated successfully!");
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (error) => {
      toast.error(`Failed to duplicate session: ${error.message}`);
    },
  });
  const filteredSessions = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter((session) =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sessions, searchTerm]);
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>All Sessions</CardTitle>
                  <CardDescription>Search, filter, and manage your troubleshooting sessions.</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Input
                    placeholder="Filter by title or tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64" />
                  <CreateSessionDialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" /> New
                    </Button>
                  </CreateSessionDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/2">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ?
                  [...Array(5)].map((_, i) =>
                  <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                      </TableRow>
                  ) :
                  filteredSessions.length > 0 ?
                  filteredSessions.map((session) =>
                  <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          <Link to={`/app/sessions/${session.id}`} className="hover:underline">
                            {session.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("capitalize", statusColors[session.status])}>{session.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn("capitalize border-l-4 pl-2", priorityColors[session.priority])}>{session.priority}</span>
                        </TableCell>
                        <TableCell>{formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/app/sessions/${session.id}`}>View</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => duplicateSessionMutation.mutate(session.id)} disabled={duplicateSessionMutation.isPending}>
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                  ) :
                  <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No sessions found.
                      </TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>);
}