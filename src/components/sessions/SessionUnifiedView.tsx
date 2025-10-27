import { Session, SessionEntryType } from "@shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Search, BarChart, Clock, Shield, Hash } from "lucide-react";
import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
const StatCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: string | number }) => (
  <Card className="bg-secondary/50">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold capitalize">{value}</div>
    </CardContent>
  </Card>
);
export default function SessionUnifiedView({ session }: { session: Session }) {
  const { hypotheses, findings } = useMemo(() => {
    const hypotheses = session.entries.filter(e => e.type === SessionEntryType.Hypothesis);
    const findings = session.entries.filter(e => e.type === SessionEntryType.Finding);
    return { hypotheses, findings };
  }, [session.entries]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<BarChart className="h-4 w-4 text-muted-foreground" />} title="Status" value={session.status} />
        <StatCard icon={<Shield className="h-4 w-4 text-muted-foreground" />} title="Priority" value={session.priority} />
        <StatCard icon={<Hash className="h-4 w-4 text-muted-foreground" />} title="Entries" value={session.entries.length} />
        <StatCard icon={<Clock className="h-4 w-4 text-muted-foreground" />} title="Duration" value={formatDistanceToNow(new Date(session.createdAt))} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Hypotheses ({hypotheses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hypotheses.length > 0 ? (
              <ul className="space-y-3 list-disc list-inside">
                {hypotheses.map(h => <li key={h.id} className="text-sm">{h.content}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hypotheses recorded.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-500" />
              Findings ({findings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {findings.length > 0 ? (
              <ul className="space-y-3 list-disc list-inside">
                {findings.map(f => <li key={f.id} className="text-sm">{f.content}</li>)}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No findings recorded.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}