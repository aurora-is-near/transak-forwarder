export type ForwarderApiCreateContractResponse = {
  result: {
    address: string
    existed: boolean
  }
}

export type ForwarderApiGetContractResponse = {
  result: {
    address: string
    account_created: boolean
  }
}

export type ForwarderApiContractParams = {
  targetAddress: string
  targetNetwork: string
}
