import { IndexedEntity } from "./core-utils";
import type { Session, SessionEntry } from "@shared/types";
import { SessionStatus, PriorityLevel, SessionEntryType } from "@shared/types";
const SEED_SESSIONS: Session[] = [
  {
    id: 'seed-1',
    title: 'API Gateway returning 502 Bad Gateway',
    description: 'The primary API gateway is intermittently failing with 502 errors, impacting all downstream services. Started around 9:15 AM.',
    status: SessionStatus.Active,
    priority: PriorityLevel.Critical,
    environment: 'Production',
    tags: ['api-gateway', 'networking', '5xx-errors'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    entries: [
      { id: 'e1-1', type: SessionEntryType.Hypothesis, content: 'Possible issue with upstream service health checks.', createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() },
      { id: 'e1-2', type: SessionEntryType.Action, content: 'Checked CloudWatch logs for the ALB. Found spikes in unhealthy host counts.', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { id: 'e1-3', type: SessionEntryType.Finding, content: 'The `auth-service` is failing its health check path `/healthz`.', createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'seed-2',
    title: 'User profile pictures not loading on mobile',
    description: 'Users on iOS and Android are reporting that profile pictures are not displaying. Web app is unaffected.',
    status: SessionStatus.Active,
    priority: PriorityLevel.High,
    environment: 'Production',
    tags: ['mobile', 'cdn', 'asset-delivery'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    entries: [],
  },
  {
    id: 'seed-3',
    title: 'Database CPU utilization at 100%',
    description: 'The main PostgreSQL instance has pinned CPU at 100% for the last 30 minutes.',
    status: SessionStatus.Resolved,
    priority: PriorityLevel.Critical,
    environment: 'Production',
    tags: ['database', 'performance', 'postgres'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    entries: [],
  },
  {
    id: 'seed-4',
    title: 'CI/CD pipeline failing on `npm install`',
    description: 'The build pipeline is blocked due to a dependency resolution issue in the `npm install` step.',
    status: SessionStatus.Blocked,
    priority: PriorityLevel.Medium,
    environment: 'Staging',
    tags: ['ci-cd', 'dependencies'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    entries: [],
  },
];
export class SessionEntity extends IndexedEntity<Session> {
  static readonly entityName = "session";
  static readonly indexName = "sessions";
  static readonly initialState: Session = {
    id: "",
    title: "",
    description: "",
    status: SessionStatus.Active,
    priority: PriorityLevel.Medium,
    environment: "",
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: [],
  };
  static seedData = SEED_SESSIONS;
  async addEntry(entry: Omit<SessionEntry, 'id' | 'createdAt'>): Promise<SessionEntry> {
    const newEntry: SessionEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await this.mutate(s => ({
      ...s,
      entries: [...s.entries, newEntry].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      updatedAt: new Date().toISOString(),
    }));
    return newEntry;
  }
}