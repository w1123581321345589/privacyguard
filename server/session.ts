import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  console.warn('WARNING: SESSION_SECRET not set. Using a default secret for development only.');
}

export const sessionMiddleware = session({
  secret: sessionSecret || 'dev-secret-DO-NOT-USE-IN-PRODUCTION',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  }
});
