/** Row shape for `public.access_tokens` (Postgres). */
export type AccessTokenRow = {
  id: number
  access_token: string
  api_key: string
  created_at: string
}

export type AccessTokenInsert = {
  access_token: string
  api_key: string
  created_at?: string
  id?: number
}
