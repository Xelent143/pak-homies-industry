import { Router } from "express";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/fix-db-schema", async (req, res) => {
    try {
        const db = await getDb();
        if (!db) {
            return res.status(500).json({ error: "No database connection" });
        }

        await db.execute(sql`
            ALTER TABLE \`users\`
            ADD COLUMN \`savedModelImageBase64\` LONGTEXT,
            ADD COLUMN \`savedModelImageMimeType\` VARCHAR(255);
        `);

        return res.json({ success: true, message: "Columns added successfully" });
    } catch (error: any) {
        if (error.message && error.message.includes("Duplicate column name")) {
            return res.json({ success: true, message: "Columns already exist" });
        }
        return res.status(500).json({ error: error.message, stack: error.stack });
    }
});

router.get("/setup-tryon-table", async (req, res) => {
    try {
        const db = await getDb();
        if (!db) {
            return res.status(500).json({ error: "No database connection" });
        }

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS \`saved_tryon_models\` (
              \`id\` INT AUTO_INCREMENT PRIMARY KEY,
              \`name\` VARCHAR(255),
              \`imageUrl\` VARCHAR(1000) NOT NULL,
              \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        `);

        return res.json({ success: true, message: "saved_tryon_models table created successfully" });
    } catch (error: any) {
        return res.status(500).json({ error: error.message, stack: error.stack });
    }
});

export default router;
