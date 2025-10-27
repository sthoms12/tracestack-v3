import { Session, SessionEntryType } from "@shared/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { ReactNode } from "react";
type RcaReportDialogProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session;
};
export default function RcaReportDialog({ children, open, onOpenChange, session }: RcaReportDialogProps) {
  const findings = session.entries.filter(e => e.type === SessionEntryType.Finding);
  const handlePrint = () => {
    window.print();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Root Cause Analysis (RCA) Report</DialogTitle>
          <DialogDescription>
            A summary of the troubleshooting session for "{session.title}".
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1">
          <div className="prose prose-sm dark:prose-invert max-w-none pr-4">
            <h2>Problem Statement</h2>
            <p>{session.description}</p>
            <h3>Session Details</h3>
            <ul>
              <li><strong>Status:</strong> <span className="capitalize">{session.status}</span></li>
              <li><strong>Priority:</strong> <span className="capitalize">{session.priority}</span></li>
              <li><strong>Environment:</strong> {session.environment}</li>
              <li><strong>Started:</strong> {format(new Date(session.createdAt), 'PPpp')}</li>
            </ul>
            <h2>Timeline of Key Events</h2>
            <ol>
              {session.entries.map(entry => (
                <li key={entry.id}>
                  <strong>{format(new Date(entry.createdAt), 'Pp')}:</strong> [{entry.type.toUpperCase()}] {entry.content}
                </li>
              ))}
            </ol>
            <h2>Key Findings & Root Cause</h2>
            {findings.length > 0 ? (
              <ul>
                {findings.map(finding => (
                  <li key={finding.id}>{finding.content}</li>
                ))}
              </ul>
            ) : (
              <p>No key findings were explicitly marked in this session.</p>
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4">
          <Button onClick={handlePrint}>Print Report</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}