import { IndexedEntity } from "./core-utils";
import type { Session, SessionEntry, BrainstormData, User } from "@shared/types";
import { SessionStatus, PriorityLevel, SessionEntryType, KanbanState } from "@shared/types";
import type { Env } from './core-utils';
// --- USER ENTITY ---
interface UserState extends User {
  hashedPassword: string;
}
export class UserEntity extends IndexedEntity<UserState> {
  static readonly entityName = "user";
  static readonly indexName = "users_by_email";
  static readonly initialState: UserState = {
    id: "",
    email: "",
    hashedPassword: "",
  };
  static keyOf(state: any): string {
    return state.email.toLowerCase();
  }
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const hashedPassword = await UserEntity.hashPassword(password);
    return hashedPassword === hash;
  }
  async toJSON(): Promise<User> {
    const state = await this.getState();
    return {
      id: state.id,
      email: state.email,
    };
  }
}
// --- SESSION ENTITY ---
const getSeedSessionsForUser = (userId: string): Omit<Session, 'id'>[] => [
  {
    userId,
    title: 'API Gateway returning 502 Bad Gateway',
    description: 'The primary API gateway is intermittently failing with 502 errors, impacting all downstream services. Started around 9:15 AM.',
    status: SessionStatus.Active,
    priority: PriorityLevel.Critical,
    environment: 'Production',
    tags: ['api-gateway', 'networking', '5xx-errors'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    entries: [
      { id: 'e1-1', type: SessionEntryType.Hypothesis, content: 'Possible issue with upstream service health checks.', createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), kanbanState: KanbanState.Done },
      { id: 'e1-2', type: SessionEntryType.Action, content: 'Checked CloudWatch logs for the ALB. Found spikes in unhealthy host counts.', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), kanbanState: KanbanState.Done },
      { id: 'e1-3', type: SessionEntryType.Finding, content: 'The `auth-service` is failing its health check path `/healthz`.', createdAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(), kanbanState: KanbanState.InProgress },
    ],
    rawNotes: "Initial investigation points towards the auth-service. Need to check its deployment status and recent changes.",
    brainstormData: undefined,
  },
  {
    userId,
    title: 'User profile pictures not loading on mobile',
    description: 'Users on iOS and Android are reporting that profile pictures are not displaying. Web app is unaffected.',
    status: SessionStatus.Active,
    priority: PriorityLevel.High,
    environment: 'Production',
    tags: ['mobile', 'cdn', 'asset-delivery'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    entries: [
      { id: 'e2-1', type: SessionEntryType.Hypothesis, content: 'Investigate CDN configuration for mobile user agents.', createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), kanbanState: KanbanState.Todo },
    ],
    rawNotes: "",
    brainstormData: undefined,
  },
];
export class SessionEntity extends IndexedEntity<Session> {
  static readonly entityName = "session";
  static readonly indexName = "sessions";
  static readonly initialState: Session = {
    id: "",
    userId: "",
    title: "",
    description: "",
    status: SessionStatus.Active,
    priority: PriorityLevel.Medium,
    environment: "",
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    entries: [],
    rawNotes: "",
    brainstormData: undefined,
  };
  static async seedForUser(env: Env, userId: string): Promise<Session[]> {
    const seedData = getSeedSessionsForUser(userId);
    const createdSessions: Session[] = [];
    for (const sessionData of seedData) {
      const newSession: Session = {
        ...sessionData,
        id: crypto.randomUUID(),
      };
      await SessionEntity.create(env, newSession);
      createdSessions.push(newSession);
    }
    return createdSessions;
  }
  async addEntry(entry: Omit<SessionEntry, 'id' | 'createdAt'>): Promise<SessionEntry> {
    const newEntry: SessionEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      kanbanState: entry.kanbanState ?? KanbanState.Todo,
    };
    await this.mutate(s => ({
      ...s,
      entries: [...s.entries, newEntry].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      updatedAt: new Date().toISOString(),
    }));
    return newEntry;
  }
  async updateEntryKanbanState(entryId: string, kanbanState: KanbanState): Promise<Session> {
    return this.mutate(s => {
      const entryIndex = s.entries.findIndex(e => e.id === entryId);
      if (entryIndex === -1) {
        return s; // Entry not found, do nothing
      }
      const updatedEntries = [...s.entries];
      updatedEntries[entryIndex] = { ...updatedEntries[entryIndex], kanbanState };
      return {
        ...s,
        entries: updatedEntries,
        updatedAt: new Date().toISOString(),
      };
    });
  }
  async updateRawNotes(notes: string): Promise<Session> {
    return this.mutate(s => ({
      ...s,
      rawNotes: notes,
      updatedAt: new Date().toISOString(),
    }));
  }
  async updateBrainstormData(data: BrainstormData | null): Promise<Session> {
    return this.mutate(s => ({
      ...s,
      brainstormData: data === null ? undefined : data,
      updatedAt: new Date().toISOString(),
    }));
  }
  async updateStatus(status: SessionStatus): Promise<Session> {
    return this.mutate(s => ({
      ...s,
      status,
      updatedAt: new Date().toISOString(),
    }));
  }
  async update(updates: Partial<Session>): Promise<Session> {
    return this.mutate(s => ({
      ...s,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }
  async duplicate(): Promise<Session> {
    const originalState = await this.getState();
    const now = new Date().toISOString();
    const newSession: Session = {
      ...originalState,
      id: crypto.randomUUID(),
      title: `[COPY] ${originalState.title}`,
      createdAt: now,
      updatedAt: now,
      status: SessionStatus.Active,
    };
    return SessionEntity.create(this.env, newSession);
  }
}