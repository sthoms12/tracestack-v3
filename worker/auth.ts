import { jwt, sign, verify } from 'hono/jwt'
import { Context, Next } from 'hono'
import { bad } from './core-utils'
// In a real production app, this secret should be stored securely in environment variables.
const JWT_SECRET = 'this-is-a-super-secret-key-for-tracestack'
export interface TokenPayload {
  id: string;
  email: string;
}
export const authMiddleware = jwt({
  secret: JWT_SECRET,
})
export const signToken = async (payload: { id: string; email: string }) => {
  return await sign(payload, JWT_SECRET)
}
