import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // 1. First try OAuth
    user = await sdk.authenticateRequest(opts.req);
  } catch (_oauthError) {
    // OAuth failed — try local admin JWT
  }

  // 2. If OAuth didn't work, check for our admin_token cookie
  if (!user) {
    try {
      const cookieHeader = opts.req.headers.cookie || "";
      // Simple cookie parser — no external dependency needed
      const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (token) {
        const { jwtVerify } = await import("jose");
        const JWT_SECRET = new TextEncoder().encode(
          process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345"
        );
        const { payload } = await jwtVerify(token, JWT_SECRET);

        if (payload.userId) {
          const { getDb } = await import("../db");
          const { users } = await import("../../drizzle/schema");
          const { eq } = await import("drizzle-orm");

          const db = await getDb();
          if (db) {
            const results = await db.select().from(users).where(eq(users.id, payload.userId as number)).limit(1);
            if (results[0]) {
              user = results[0];
            }
          }
        }
      }
    } catch (_jwtError) {
      // Invalid JWT or DB error — stay unauthenticated
    }
  }

  // 3. LOCAL DEV BYPASS (disabled in production unless explicitly enabled)
  const bypassEnabled = process.env.ENABLE_ADMIN_BYPASS === "true";
  if ((!IS_PRODUCTION || bypassEnabled) && !user) {
    user = {
      id: 1,
      openId: "remote-admin",
      name: "Admin User",
      email: "admin@pakhomiesind.com",
      role: "admin",
      loginMethod: "local",
      lastSignedIn: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

