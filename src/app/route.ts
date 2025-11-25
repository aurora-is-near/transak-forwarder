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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const apiKey = searchParams.get("apiKey")
  const apiSecret = searchParams.get("apiSecret")

  // Required query parameters
  // const apiKey = searchParams.get("apiKey")
  const walletAddress = searchParams.get("walletAddress")
  const siloEngineAccountId = searchParams.get("silo")

  // Optional query parameters
  const fiatAmount = searchParams.get("fiatAmount") || "50"
  const fiatCurrency = searchParams.get("fiatCurrency") || "EUR"
  const defaultFiatAmount = searchParams.get("defaultFiatAmount") || "0"
  const defaultCryptoAmount = searchParams.get("defaultCryptoAmount") || "0"
  const cryptoCurrencyCode = searchParams.get("cryptoCurrencyCode") || "NEAR"
  const environment = searchParams.get("environment") || "staging"

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

  const body = {
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
 
  const widgetUrl = await createTransakSession(environment, body, accessToken)

  if (!widgetUrl) {
    return new NextResponse("Failed to create Transak session", { status: 500 })
  }

  if (req.method === "POST") {
    return NextResponse.json({ widgetUrl })
  }

  const url = new URL(widgetUrl)

  return NextResponse.redirect(url.href)
}
