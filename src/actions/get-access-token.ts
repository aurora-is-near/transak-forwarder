import { getPool } from "@/lib/db"

export const getAccessToken = async (apiKey: string) => {
  try {
    const pool = getPool()
    const since = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString()

    const result = await pool.query<{ access_token: string }>(
      `SELECT access_token
       FROM access_tokens
       WHERE api_key = $1 AND created_at >= $2::timestamptz
       ORDER BY created_at DESC
       LIMIT 1`,
      [apiKey, since]
    )

    const token = result.rows[0]?.access_token
    if (!token) {
      return null
    }

    return token
  } catch (error) {
    console.error("Unexpected error retrieving access token:", error)
    return null
  }
}
