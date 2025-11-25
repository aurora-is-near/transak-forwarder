import { saveAccessToken } from "./save-access-token"

export const refreshTransakToken = async (apiSecret: string, environment: string, apiKey: string) => {
  const baseUrl =
    environment === "production"
      ? "https://api.transak.com"
      : "https://api-stg.transak.com"
      
  const accessTokenResponse = await fetch(`${baseUrl}/partners/api/v2/refresh-token`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-secret": apiSecret,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        "environment": environment,
        "apiKey": apiKey,
      }),
    })

    const accessTokenData = await accessTokenResponse.json().catch((e) => {
      console.error(e)
      return ({ data: { accessToken: null } })
    })

  const accessToken = accessTokenData.data.accessToken
  
  if (accessToken) {
    const result = await saveAccessToken(accessToken, apiKey)
    if (!result.success) {
      console.error("Failed to save access token:", result.error)
    }
  }

  return accessToken
}