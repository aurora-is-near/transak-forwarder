import { Pool } from "pg"

const globalForPool = globalThis as unknown as { pgPool: Pool | undefined }

export function getPool(): Pool {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL is required")
  }
  if (!globalForPool.pgPool) {
    globalForPool.pgPool = new Pool({ connectionString: url })
  }
  return globalForPool.pgPool
}
