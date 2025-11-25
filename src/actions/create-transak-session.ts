type WidgetSessionBody = {
  widgetParams: {
    apiKey: string
    referrerDomain: string
    fiatAmount: string
    defaultFiatAmount: string
    defaultCryptoAmount: string
    fiatCurrency: string
    cryptoCurrencyCode: string
    walletAddress: string
  }
}

export const createTransakSession = async (
  environment: string,
  body: WidgetSessionBody, 
  accessToken: string
) => {
  const baseUrl =
    environment === "production"
      ? "https://api-gateway.transak.com"
      : "https://api-gateway-stg.transak.com"

  const sessionResponse = await fetch(`${baseUrl}/api/v2/auth/session`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "access-token": accessToken || "",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!sessionResponse.ok) {
    console.error(`Failed to create Transak session: ${sessionResponse.status}`)
  }
  
  const sessionData = await sessionResponse.json()

  return sessionData.data.widgetUrl
}