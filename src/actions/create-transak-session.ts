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
  try {
    const baseUrl =
      environment === "production"
        ? "https://api-gateway.transak.com"
        : "https://api-gateway-stg.transak.com"

    const sessionResponse = await fetch(`${baseUrl}/api/v2/auth/session`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "access-token": accessToken,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!sessionResponse.ok) {
      console.error(`Failed to create Transak session: ${sessionResponse.status}`)
    }

    const sessionData = await sessionResponse.json()
    
    if (!sessionData?.data?.widgetUrl) {
      throw new Error("Invalid session response: missing widgetUrl")
    }

    return sessionData.data.widgetUrl
  } catch (error) {
    console.error("Unexpected error creating Transak session:", error)
    return null
  }
}