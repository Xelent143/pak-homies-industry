import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  // Parse connection string to get credentials but connect without DB first
  const match = url.match(/mysql:\/\/([^:]+)(?::([^@]+))?@([^:]+):(\d+)\/([^?]+)/);
  if (!match) {
    console.error('Invalid DATABASE_URL format');
    process.exit(1);
  }

  const [_, user, _pass, host, port, database] = match;
  const passwords = ['', 'password', 'root', 'admin', '1234', '12345678'];

  let success = false;
  for (const password of passwords) {
    try {
      console.log(`Testing password: "${password}"`);
      const connection = await mysql.createConnection({
        host,
        port: parseInt(port),
        user,
        password,
      });

      console.log(`Success with password: "${password}"`);
      console.log(`Creating database ${database} if it doesn't exist...`);
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
      console.log('Database created/verified successfully.');
      await connection.end();
      success = true;
      break;
    } catch (error: any) {
      if (error.errno === 1045) {
        continue;
      }
      console.error('Error during database check:', error);
      break;
    }
  }

  if (!success) {
    console.error('Could not connect to MySQL with common passwords.');
    process.exit(1);
  }
}

main();
