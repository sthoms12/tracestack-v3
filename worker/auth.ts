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
export const getTokenPayload = async (c: Context): Promise<TokenPayload | null> => {
  try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    const token = authHeader.substring(7)
    return (await verify(token, JWT_SECRET)) as TokenPayload
  } catch (e) {
    return null
  }
}