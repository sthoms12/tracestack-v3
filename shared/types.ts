export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export enum SessionStatus {
  Active = 'active',
  Resolved = 'resolved',
  Blocked = 'blocked',
  Archived = 'archived',
}
export enum PriorityLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}
export enum SessionEntryType {
  Hypothesis = 'hypothesis',
  Action = 'action',
  Finding = 'finding',
  Note = 'note',
}
export enum KanbanState {
  Todo = 'todo',
  InProgress = 'inprogress',
  Done = 'done',
}
export interface SessionEntry {
  id: string;
  type: SessionEntryType;
  content: string;
  createdAt: string; // ISO 8601 string
  kanbanState?: KanbanState;
}
export interface Session {
  id: string;
  title: string;
  description: string;
  status: SessionStatus;
  priority: PriorityLevel;
  environment: string;
  tags: string[];
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  entries: SessionEntry[];
}
export interface SessionStats {
  active: number;
  resolved: number;
  blocked: number;
  archived: number;
}