// ! Todo: Move this file to MultiWalletService.ts
import { makeVar } from '@apollo/client'
import Web3 from 'web3'

// eslint-disable-next-line no-shadow
export enum MultiWalletProvider {
  metaMask = 'metaMask',
  walletConnect = 'walletConnect'
}

// eslint-disable-next-line no-shadow
export enum WalletProvider {
  /**
   * @deprecated Deprecated in favor of TheGraph
   */
  web3 = 'web3',
  api = 'api',
  theGraph = 'theGraph'
}

export const accountVar = makeVar<string | undefined>(undefined)
// TODO: Change chainIdVar to be <number | undefined> and initialize with undefined
export const chainIdVar = makeVar<number>(3)
export const nftfyBalanceVar = makeVar<string | undefined>(undefined)
export const providerVar = makeVar<MultiWalletProvider | undefined>(undefined)
export const web3Var = makeVar<Web3 | undefined>(undefined)
export const walletVar = makeVar<string | undefined>(undefined)

export const connectWalletModalVar = makeVar<boolean>(false)
export const wrongNetworkModalVar = makeVar(false)
export const nftInWalletUpdateVar = makeVar(false)

export const tokenNameVar = makeVar<string>('bsc')
export const contractAddressVar = makeVar<string>(window.localStorage.getItem('contractAddress')? window.localStorage.getItem('contractAddress'): '')
export const multiplyerVar = makeVar<number>(parseFloat(window.localStorage.getItem('multiplyer'))? parseFloat(window.localStorage.getItem('multiplyer')): 1)
export const networkVar = makeVar<any>([])
export const multichartNetworksVar = makeVar<any>([])

export const languageVar = makeVar<string>(window.localStorage.getItem('language')? window.localStorage.getItem('language'): 'english')

export const setProviderStorage = (provider: MultiWalletProvider | undefined) => {
  providerVar(provider)
  provider ? window.localStorage.setItem('provider', provider) : window.localStorage.removeItem('provider')
}

export const setChainIdStorage = (chainId: number | undefined) => {
  chainIdVar(chainId)
  chainId ? window.localStorage.setItem('chainId', String(chainId)) : window.localStorage.removeItem('chainId')
}

export const clearMultiWalletVars = () => {
  accountVar(undefined)
  chainIdVar(1) // Todo: replace by undefined
  setProviderStorage(undefined)
  setChainIdStorage(undefined)
  nftfyBalanceVar(undefined)
  web3Var(undefined)
}
