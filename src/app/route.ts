import { getAddress } from "ethers"
import { NextRequest, NextResponse } from "next/server"
import { forwarderApiClient } from "@/forwarder-api-client"

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

  // Required query parameters
  const apiKey = searchParams.get("apiKey")
  const walletAddress = searchParams.get("walletAddress")
  const siloEngineAccountId = searchParams.get("silo")

  // Optional query parameters
  const fiatAmount = searchParams.get("fiatAmount")
  const fiatCurrency = searchParams.get("fiatCurrency")
  const defaultFiatAmount = searchParams.get("defaultFiatAmount")
  const defaultCryptoAmount = searchParams.get("defaultCryptoAmount")
  const environment = searchParams.get("environment")

  if (!apiKey) {
    return missingParameterResponse("apiKey")
  }

  if (!walletAddress) {
    return missingParameterResponse("walletAddress")
  }

  if (!siloEngineAccountId) {
    return missingParameterResponse("silo")
  }

  const targetAddress = getAddress(walletAddress)

  const url = new URL("https://global.transak.com/")

  url.searchParams.set("network", "near")
  url.searchParams.set("apiKey", apiKey)
  url.searchParams.set("disableWalletAddressForm", "true")
  url.searchParams.set(
    "walletAddress",
    await getForwarderAddress(targetAddress, siloEngineAccountId),
  )

  if (fiatAmount) {
    url.searchParams.set("fiatAmount", fiatAmount)
  }

  if (fiatCurrency) {
    url.searchParams.set("fiatCurrency", fiatCurrency)
  }

  if (defaultFiatAmount) {
    url.searchParams.set("defaultFiatAmount", defaultFiatAmount)
  }

  if (defaultCryptoAmount) {
    url.searchParams.set("defaultCryptoAmount", defaultCryptoAmount)
  }

  if (environment) {
    url.searchParams.set("environment", environment)
  }

  return NextResponse.redirect(url.href)
}
