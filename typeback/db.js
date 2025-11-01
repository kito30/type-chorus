import { mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

let dbInstance;

export async function getDb() {
  if (dbInstance) return dbInstance;
  const file = process.env.DATABASE_FILE || './data/db.json';
  const abs = resolve(file);
  const dir = dirname(abs);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const adapter = new JSONFile(abs);
  const db = new Low(adapter, { users: [] });
  await db.read();
  db.data ||= { users: [] };
  await db.write();
  dbInstance = db;
  return dbInstance;
}
