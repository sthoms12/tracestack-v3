import { Session, SessionStatus, PriorityLevel } from "@shared/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};
const statusColors: Record<SessionStatus, string> = {
  [SessionStatus.Active]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  [SessionStatus.Resolved]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  [SessionStatus.Blocked]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  [SessionStatus.Archived]: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};
const priorityBorderColors: Record<PriorityLevel, string> = {
  [PriorityLevel.Low]: "border-l-green-500",
  [PriorityLevel.Medium]: "border-l-blue-500",
  [PriorityLevel.High]: "border-l-yellow-500",
  [PriorityLevel.Critical]: "border-l-red-500",
};
export default function SessionCard({ session }: { session: Session }) {
  return (
    <motion.div variants={itemVariants} className="h-full">
      <Link to={`/app/sessions/${session.id}`} className="block h-full hover:-translate-y-1 transition-transform duration-200">
        <Card className={cn("h-full flex flex-col border-l-4", priorityBorderColors[session.priority])}>
          <CardHeader>
            <CardTitle className="text-lg">{session.title}</CardTitle>
            <CardDescription>
              Updated {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={cn("capitalize", statusColors[session.status])}>{session.status}</Badge>
              <span className="text-sm text-muted-foreground">{session.environment}</span>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-wrap gap-2">
              {session.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}