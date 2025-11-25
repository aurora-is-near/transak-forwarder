import { getAddress } from "ethers"
import { NextRequest, NextResponse } from "next/server"
import { forwarderApiClient } from "@/forwarder-api-client"
import { refreshTransakToken } from "@/actions/refresh-transak-token"
import { getAccessToken } from "@/actions/get-access-token"
import { createTransakSession } from "@/actions/create-transak-session"

const getForwarderAddress = async (
  targetAddress: string,
  targetNetwork: string,
) => {
  const { result: currentContractResult } =
    await forwarderApiClient.getContract({
      targetAddress,
      targetNetwork,
    })

  if (currentContractResult.address) {
    return currentContractResult.address
  }

  const { result: newContractResult } = await forwarderApiClient.createContract(
    {
      targetAddress,
      targetNetwork,
    },
  )

  return newContractResult.address
}

const missingParameterResponse = (parameterName: string) =>
  new NextResponse(`The \`${parameterName}\` query parameter is required`, {
    status: 400,
  })

const readFromBodyOrQueryParams = (
  req: NextRequest, 
  body: Record<string, string> | null, 
  parameterName: string
): string | null => {
  const { searchParams } = req.nextUrl
  const value = (body && body[parameterName]) || searchParams.get(parameterName)
  if (!value) {
    return null
  }
  return value
}

export async function handleRequest(req: NextRequest) {
  let body = null
  try {
    if (req.method === "POST") {
      body = await req.json()
    }
  } catch {
    // Ignore JSON parsing errors (e.g. empty body)
  }

  // Required query parameters
  const apiKey = await readFromBodyOrQueryParams(req, body, "apiKey")
  const apiSecret = await readFromBodyOrQueryParams(req, body, "apiSecret")
  const walletAddress = await readFromBodyOrQueryParams(req, body, "walletAddress")
  const siloEngineAccountId = await readFromBodyOrQueryParams(req, body, "silo")

  // Optional query parameters
  const fiatAmount = await readFromBodyOrQueryParams(req, body, "fiatAmount") || "50"
  const fiatCurrency = await readFromBodyOrQueryParams(req, body, "fiatCurrency") || "EUR"
  const defaultFiatAmount = await readFromBodyOrQueryParams(req, body, "defaultFiatAmount") || "0"
  const defaultCryptoAmount = await readFromBodyOrQueryParams(req, body, "defaultCryptoAmount") || "0"
  const cryptoCurrencyCode = await readFromBodyOrQueryParams(req, body, "cryptoCurrencyCode") || "NEAR"
  const environment = await readFromBodyOrQueryParams(req, body, "environment") || "staging"

  if (!apiKey) {
    return missingParameterResponse("apiKey")
  }
  if (!apiSecret) {
    return missingParameterResponse("apiSecret")
  }
  if (!walletAddress) {
    return missingParameterResponse("walletAddress")
  }
  if (!siloEngineAccountId) {
    return missingParameterResponse("silo")
  }

  const targetAddress = getAddress(walletAddress)
  const forwarderAddress = await getForwarderAddress(targetAddress, siloEngineAccountId)

  const savedAccessToken = await getAccessToken(apiKey)

  const accessToken = 
    savedAccessToken ?? 
    await refreshTransakToken(apiSecret, environment, apiKey)
      
  if (!accessToken) {
    return new NextResponse("Failed to obtain access token", { status: 401 })
  }

  const widgetRequestData = {
    "widgetParams": {
      "apiKey": apiKey,
      "referrerDomain": "auroracloud.dev",
      "fiatAmount": fiatAmount,
      "defaultFiatAmount": defaultFiatAmount,
      "defaultCryptoAmount": defaultCryptoAmount,
      "fiatCurrency": fiatCurrency,
      "cryptoCurrencyCode": cryptoCurrencyCode,
      "walletAddress": forwarderAddress,
    },
  }
 
  const widgetUrl = await createTransakSession(environment, widgetRequestData, accessToken)

  if (!widgetUrl) {
    return new NextResponse("Failed to create Transak session", { status: 500 })
  }

  // If it is a POST request, return JSON
  if (req.method === "POST") {
    return NextResponse.json({ widgetUrl })
  }

  // If it is a GET request, redirect
  const url = new URL(widgetUrl)

  return NextResponse.redirect(url.href)
}

export { handleRequest as GET, handleRequest as POST }