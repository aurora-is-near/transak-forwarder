import { getPool } from "@/lib/db"
import type { AccessTokenInsert, AccessTokenRow } from "@/types/access-token"

export const saveAccessToken = async (
  accessToken: string,
  apiKey: string
): Promise<{
  success: boolean
  data?: AccessTokenRow
  error?: string
}> => {
  try {
    if (!accessToken) {
      throw new Error("The `access_token` field is required")
    }

    if (!apiKey) {
      throw new Error("The `api_key` field is required")
    }

    const insertData: AccessTokenInsert = {
      access_token: accessToken,
      api_key: apiKey,
    }

    const pool = getPool()
    const result = await pool.query<AccessTokenRow>(
      `INSERT INTO access_tokens (access_token, api_key)
       VALUES ($1, $2)
       ON CONFLICT (api_key) DO UPDATE SET
         access_token = EXCLUDED.access_token,
         created_at = NOW()
       RETURNING id, access_token, api_key, created_at`,
      [insertData.access_token, insertData.api_key]
    )

    const row = result.rows[0]
    if (!row) {
      throw new Error("Failed to save access token: no row returned")
    }

    return { success: true, data: row }
  } catch (error) {
    console.error("Unexpected error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    }
  }
}
