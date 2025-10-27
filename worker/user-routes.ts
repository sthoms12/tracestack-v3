import { Hono } from "hono";
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Env } from './core-utils';
import { SessionEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { SessionStatus, PriorityLevel, SessionEntryType, type Session, KanbanState } from "@shared/types";
const createSessionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  environment: z.string().optional(),
  priority: z.nativeEnum(PriorityLevel).default(PriorityLevel.Medium),
  tags: z.array(z.string()).optional(),
});
const createEntrySchema = z.object({
  type: z.nativeEnum(SessionEntryType),
  content: z.string().min(1, 'Content cannot be empty'),
});
const updateKanbanStateSchema = z.object({
  kanbanState: z.nativeEnum(KanbanState),
});
const updateNotesSchema = z.object({
  notes: z.string(),
});
const updateBrainstormSchema = z.object({
  data: z.any(),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use('/api/*', async (c, next) => {
    await SessionEntity.ensureSeed(c.env);
    await next();
  });
  // GET all sessions
  app.get('/api/sessions', async (c) => {
    const { items } = await SessionEntity.list(c.env);
    // sort by most recently updated
    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.createdAt).getTime());
    return ok(c, items);
  });
  // POST a new session
  app.post('/api/sessions', zValidator('json', createSessionSchema), async (c) => {
    const body = c.req.valid('json');
    const now = new Date().toISOString();
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description ?? '',
      environment: body.environment ?? '',
      priority: body.priority,
      tags: body.tags ?? [],
      status: SessionStatus.Active,
      createdAt: now,
      updatedAt: now,
      entries: [],
      rawNotes: "",
      brainstormData: null,
    };
    const created = await SessionEntity.create(c.env, newSession);
    return ok(c, created);
  });
  // GET session stats
  app.get('/api/sessions/stats', async (c) => {
    const { items } = await SessionEntity.list(c.env);
    const stats = items.reduce((acc, session) => {
      acc[session.status] = (acc[session.status] || 0) + 1;
      return acc;
    }, {} as Record<SessionStatus, number>);
    return ok(c, {
      active: stats.active ?? 0,
      resolved: stats.resolved ?? 0,
      blocked: stats.blocked ?? 0,
      archived: stats.archived ?? 0,
    });
  });
  // GET a single session by ID
  app.get('/api/sessions/:id', async (c) => {
    const { id } = c.req.param();
    const session = new SessionEntity(c.env, id);
    if (!(await session.exists())) {
      return notFound(c, 'Session not found');
    }
    return ok(c, await session.getState());
  });
  // POST a new entry to a session
  app.post('/api/sessions/:id/entries', zValidator('json', createEntrySchema), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const session = new SessionEntity(c.env, id);
    if (!(await session.exists())) {
      return notFound(c, 'Session not found');
    }
    const newEntry = await session.addEntry(body);
    return ok(c, newEntry);
  });
  // PUT update an entry's kanban state
  app.put('/api/sessions/:id/entries/:entryId/kanban', zValidator('json', updateKanbanStateSchema), async (c) => {
    const { id, entryId } = c.req.param();
    const { kanbanState } = c.req.valid('json');
    const session = new SessionEntity(c.env, id);
    if (!(await session.exists())) {
      return notFound(c, 'Session not found');
    }
    const updatedSession = await session.updateEntryKanbanState(entryId, kanbanState);
    return ok(c, updatedSession);
  });
  // PUT update raw notes
  app.put('/api/sessions/:id/notes', zValidator('json', updateNotesSchema), async (c) => {
    const { id } = c.req.param();
    const { notes } = c.req.valid('json');
    const session = new SessionEntity(c.env, id);
    if (!(await session.exists())) {
      return notFound(c, 'Session not found');
    }
    const updatedSession = await session.updateRawNotes(notes);
    return ok(c, updatedSession);
  });
  // PUT update brainstorm data
  app.put('/api/sessions/:id/brainstorm', zValidator('json', updateBrainstormSchema), async (c) => {
    const { id } = c.req.param();
    const { data } = c.req.valid('json');
    const session = new SessionEntity(c.env, id);
    if (!(await session.exists())) {
      return notFound(c, 'Session not found');
    }
    const updatedSession = await session.updateBrainstormData(data);
    return ok(c, updatedSession);
  });
}