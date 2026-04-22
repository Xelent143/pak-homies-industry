import { Router } from "express";
import { z } from "zod";
import * as crypto from "crypto";
import { SignJWT } from "jose";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const authLocalRouter = Router();

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345"
);

// ── Password helpers (pure Node.js crypto, no native modules) ──────────────
function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${derivedKey}`;
}

function verifyPassword(password: string, hash: string): boolean {
    try {
        const [salt, key] = hash.split(":");
        if (!salt || !key) return false;
        const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
        return key === derivedKey;
    } catch {
        return false;
    }
}

// ── Ensure a default admin exists ──────────────────────────────────────────
async function ensureDefaultAdmin() {
    try {
        const db = await getDb();
        if (!db) { console.log("[Auth] DB not ready, skipping admin seed"); return; }

        // Check if ANY admin with a password already exists
        const allAdmins = await db.select().from(users).where(eq(users.role, "admin"));

        const adminWithPassword = allAdmins.find(a => a.password && a.password.includes(":"));

        if (adminWithPassword) {
            console.log("[Auth] Admin with password already exists:", adminWithPassword.email);
            return; // good to go
        }

        // If there's an admin but without a password, update it
        const adminWithoutPassword = allAdmins.find(a => !a.password || !a.password.includes(":"));
        if (adminWithoutPassword) {
            console.log("[Auth] Found admin without password, updating:", adminWithoutPassword.email);
            const hashedPassword = hashPassword("admin123");
            await db.update(users)
                .set({ password: hashedPassword, email: "admin@pakhomiesind.com" })
                .where(eq(users.id, adminWithoutPassword.id));
            console.log("[Auth] Updated admin password successfully");
            return;
        }

        // No admin at all — create one
        console.log("[Auth] No admin found. Creating default admin: admin@pakhomiesind.com / admin123");
        const hashedPassword = hashPassword("admin123");
        await db.insert(users).values({
            openId: "local-admin-" + Date.now(),
            name: "Super Admin",
            email: "admin@pakhomiesind.com",
            role: "admin",
            loginMethod: "local",
            password: hashedPassword,
        });
        console.log("[Auth] Default admin created successfully");
    } catch (err) {
        console.error("[Auth] ensureDefaultAdmin error:", err);
    }
}

// Run seed in background (won't crash if DB is unavailable)
ensureDefaultAdmin();

// ── Login endpoint ─────────────────────────────────────────────────────────
authLocalRouter.post("/api/admin/login", async (req, res) => {
    try {
        console.log("[Login] Attempt received");

        const db = await getDb();
        if (!db) {
            console.error("[Login] Database not available");
            return res.status(500).json({ error: "Database not available" });
        }

        const schema = z.object({
            email: z.string().email(),
            password: z.string().min(1),
        });

        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            console.log("[Login] Invalid input:", parsed.error.message);
            return res.status(400).json({ error: "Invalid email or password format." });
        }

        const { email, password } = parsed.data;
        console.log("[Login] Looking up user:", email);

        const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = results[0];

        if (!user) {
            console.log("[Login] No user found with that email");
            return res.status(401).json({ error: "Invalid credentials." });
        }

        if (user.role !== "admin") {
            console.log("[Login] User is not admin, role:", user.role);
            return res.status(401).json({ error: "Not an admin account." });
        }

        if (!user.password) {
            console.log("[Login] User has no password set");
            return res.status(401).json({ error: "Password not configured for this account." });
        }

        console.log("[Login] Verifying password...");
        const isValid = verifyPassword(password, user.password);
        if (!isValid) {
            console.log("[Login] Password verification failed");
            return res.status(401).json({ error: "Invalid credentials." });
        }

        console.log("[Login] Password OK, creating JWT...");

        // Update last signed in (non-blocking)
        db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id)).catch(() => { });

        // Create JWT
        const token = await new SignJWT({ userId: user.id, role: user.role })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(JWT_SECRET);

        // Set cookie — keep it simple and compatible
        res.cookie("admin_token", token, {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: req.protocol === "https" || req.headers["x-forwarded-proto"] === "https",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        console.log("[Login] Success! User:", user.email);
        return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err: any) {
        console.error("[Login] UNEXPECTED ERROR:", err?.message || err);
        console.error("[Login] Stack:", err?.stack);
        return res.status(500).json({ error: "Internal server error during login." });
    }
});

// ── Logout endpoint ────────────────────────────────────────────────────────
authLocalRouter.post("/api/admin/logout", (_req, res) => {
    res.clearCookie("admin_token", { path: "/" });
    return res.json({ success: true });
});

