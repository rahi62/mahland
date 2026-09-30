import { neon } from "@neondatabase/serverless";

export type VisitInput = {
  id: string;
  name: string;
  phone: string;
  villa: string;
  preferred: string;
  message: string;
};

let schemaReady: Promise<void> | null = null;

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(databaseUrl);
}

async function ensureSchema() {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS visits (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        villa TEXT NOT NULL,
        preferred TEXT NOT NULL DEFAULT '',
        message TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined).catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function saveVisit(visit: VisitInput) {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO visits (id, name, phone, villa, preferred, message)
    VALUES (${visit.id}, ${visit.name}, ${visit.phone}, ${visit.villa}, ${visit.preferred}, ${visit.message})
  `;
}
