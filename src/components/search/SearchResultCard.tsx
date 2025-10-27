import { Session, SessionEntry, SessionStatus } from "@shared/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
const statusColors: Record<SessionStatus, string> = {
  [SessionStatus.Active]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  [SessionStatus.Resolved]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  [SessionStatus.Blocked]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  [SessionStatus.Archived]: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};
interface SearchResultCardProps {
  session: Session;
  matchedEntry?: SessionEntry;
  searchTerm: string;
}
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 rounded px-1">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};
export default function SearchResultCard({ session, matchedEntry, searchTerm }: SearchResultCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              <Link to={`/app/sessions/${session.id}`} className="hover:underline">
                <HighlightedText text={session.title} highlight={searchTerm} />
              </Link>
            </CardTitle>
            <CardDescription>
              Updated {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge variant="outline" className={cn("capitalize", statusColors[session.status])}>{session.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {matchedEntry ? (
          <div className="text-sm p-3 bg-secondary/50 rounded-md flex items-start gap-3">
            <FileText className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-semibold capitalize text-foreground">{matchedEntry.type}: </span>
              <HighlightedText text={matchedEntry.content} highlight={searchTerm} />
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Match found in session title or description.
          </p>
        )}
      </CardContent>
    </Card>
  );
}