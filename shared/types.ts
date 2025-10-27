export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface AuthUser {
  email: string;
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
export interface BrainstormNode {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
  type?: string;
}
export interface BrainstormEdge {
  id: string;
  source: string;
  target: string;
}
export interface BrainstormData {
  nodes: BrainstormNode[];
  edges: BrainstormEdge[];
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
  rawNotes?: string;
  brainstormData?: BrainstormData;
}
export interface SessionStats {
  active: number;
  resolved: number;
  blocked: number;
  archived: number;
}