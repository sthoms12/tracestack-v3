import { Hono } from "hono";
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Env } from './core-utils';
import { SessionEntity, UserEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { SessionStatus, PriorityLevel, SessionEntryType, type Session, KanbanState, type User } from "@shared/types";
import { authMiddleware, getTokenPayload, signToken } from "./auth";
// --- ZOD SCHEMAS ---
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
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
  data: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }).nullable(),
});
const updateSessionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  description: z.string().optional(),
  environment: z.string().optional(),
  priority: z.nativeEnum(PriorityLevel).optional(),
  tags: z.array(z.string()).optional(),
  status: z.nativeEnum(SessionStatus).optional(),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- PUBLIC AUTH ROUTES ---
  app.post('/api/auth/register', zValidator('json', registerSchema), async (c) => {
    const { email, password } = c.req.valid('json');
    const user = new UserEntity(c.env, email.toLowerCase());
    if (await user.exists()) {
      return bad(c, 'User with this email already exists');
    }
    const hashedPassword = await UserEntity.hashPassword(password);
    const newUser = await UserEntity.create(c.env, {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      hashedPassword,
    });
    return ok(c, { id: newUser.id, email: newUser.email } as User);
  });
  app.post('/api/auth/login', zValidator('json', loginSchema), async (c) => {
    const { email, password } = c.req.valid('json');
    const user = new UserEntity(c.env, email.toLowerCase());
    if (!(await user.exists())) {
      return bad(c, 'Invalid email or password');
    }
    const { hashedPassword } = await user.getState();
    const isPasswordValid = await UserEntity.verifyPassword(password, hashedPassword);
    if (!isPasswordValid) {
      return bad(c, 'Invalid email or password');
    }
    const userJSON = await user.toJSON();
    const token = await signToken(userJSON);
    return ok(c, { user: userJSON, token });
  });
  // --- PROTECTED ROUTES ---
  const protectedApp = new Hono<{ Bindings: Env }>();
  protectedApp.use('*', authMiddleware);
  // GET current user
  protectedApp.get('/api/auth/me', async (c) => {
    const payload = await getTokenPayload(c);
    if (!payload?.email) {
      return notFound(c, 'User not found');
    }
    const user = new UserEntity(c.env, payload.email);
    if (!(await user.exists())) {
      return notFound(c, 'User not found');
    }
    return ok(c, await user.toJSON());
  });
  // Ensure seed data is present on first load
  protectedApp.use('/api/sessions/*', async (c, next) => {
    await SessionEntity.ensureSeed(c.env);
    await next();
  });
  // GET all sessions
  protectedApp.get('/api/sessions', async (c) => {
    const { items } = await SessionEntity.list(c.env);
    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return ok(c, items);
  });
  // POST a new session
  protectedApp.post('/api/sessions', zValidator('json', createSessionSchema), async (c) => {
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
      brainstormData: undefined,
    };
    const created = await SessionEntity.create(c.env, newSession);
    return ok(c, created);
  });
  // GET session stats
  protectedApp.get('/api/sessions/stats', async (c) => {
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
  protectedApp.get('/api/sessions/:id', async (c) => {
    const { id } = c.req.param();
    const session = new SessionEntity(c.env, id);
    if (!(await session.exists())) {
      return notFound(c, 'Session not found');
    }
    return ok(c, await session.getState());
  });
  // POST a new entry to a session
  protectedApp.post('/api/sessions/:id/entries', zValidator('json', createEntrySchema), async (c) => {
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
  protectedApp.put('/api/sessions/:id/entries/:entryId/kanban', zValidator('json', updateKanbanStateSchema), async (c) => {
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
  protectedApp.put('/api/sessions/:id/notes', zValidator('json', updateNotesSchema), async (c) => {
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
  protectedApp.put('/api/sessions/:id/brainstorm', zValidator('json', updateBrainstormSchema), async (c) => {
    const { id } = c.req.param();
    const { data } = c.req.valid('json');
    const session = new SessionEntity(c.env, id);
    if (!(await session.exists())) {
      return notFound(c, 'Session not found');
    }
    const updatedSession = await session.updateBrainstormData(data);
    return ok(c, updatedSession);
  });
  // POST duplicate a session
  protectedApp.post('/api/sessions/:id/duplicate', async (c) => {
    const { id } = c.req.param();
    const session = new SessionEntity(c.env, id);
    if (!(await session.exists())) {
      return notFound(c, 'Session not found');
    }
    const duplicatedSession = await session.duplicate();
    return ok(c, duplicatedSession);
  });
  // PATCH update a session's properties
  protectedApp.patch('/api/sessions/:id', zValidator('json', updateSessionSchema), async (c) => {
    const { id } = c.req.param();
    const body = c.req.valid('json');
    const session = new SessionEntity(c.env, id);
    if (!(await session.exists())) {
      return notFound(c, 'Session not found');
    }
    const updatedSession = await session.update(body);
    return ok(c, updatedSession);
  });
  app.route('/', protectedApp);
}