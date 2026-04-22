import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import "dotenv/config";

async function main() {
    console.log("Connecting to Database:", process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));
    try {
        const connection = await mysql.createConnection(process.env.DATABASE_URL!);
        console.log("Connected successfully. Adding columns...");

        try {
            await connection.execute('ALTER TABLE products ADD COLUMN manufacturingStory TEXT');
            console.log("Added manufacturingStory");
        } catch (e: any) { console.log(e.message); }

        try {
            await connection.execute('ALTER TABLE products ADD COLUMN manufacturingInfographic VARCHAR(1000)');
            console.log("Added manufacturingInfographic");
        } catch (e: any) { console.log(e.message); }

        await connection.end();
        console.log("Migration complete.");
    } catch (err: any) {
        console.error("Migration failed:", err.message);
    }
}

main();
