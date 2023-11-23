import * as Sentry from '@sentry/react'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import { allowedChains } from '../config'
import { Erc721Attribute, Erc721Properties, Paged } from '../types/UtilTypes'

export default function paginator<T>(items: T[], current_page: number, per_page_items: number): Paged<T[]> {
  const page = current_page || 1
  const per_page = per_page_items || 10
  const offset = (page - 1) * per_page

  const paginatedItems = items ? items.slice(offset).slice(0, per_page_items) : []
  const total_pages = items ? Math.ceil(items.length / per_page) : 0

  return {
    page,
    per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: items.length,
    total_pages,
    data: paginatedItems
  }
}

export const getErc721Metadata = async (tokenUri: string) => {
  
  try {
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    delete axios.defaults.headers.common['X-CSRF-TOKEN']; 
    delete axios.defaults.headers.common['X-Requested-With'];
    
    const metadata = await axios.get<{
      description: string
      image?: string
      imageUrl?: string
      social_media?: string
      author?: string
      name: string
      animation_url?: string
      attributes?: Erc721Attribute[] | Record<string, unknown>
      properties: Erc721Properties
    }>(safeIpfsUrl(tokenUri))
    const { name, image } = metadata.data
    return {
      image_url: safeIpfsUrl(image),
      name,
      attributes: metadata.data?.attributes
    }
  } catch (error) {
    Sentry.captureException(error)
  }

  return {
    id: '',
    description: '',
    image_url: '',
    animation_url: '',
    social_media: '',
    name: '',
    author: '',
    animationType: '',
    attributes: undefined
  }
}

export function scale(input: BigNumber, decimalPlaces: number): BigNumber {
  const scalePow = new BigNumber(decimalPlaces.toString())
  const scaleMul = new BigNumber(10).pow(scalePow)
  return input.times(scaleMul)
}

export function valid(amount: string, decimals: number): boolean {
  const regex = new RegExp(`^\\d+${decimals > 0 ? `(\\.\\d{1,${decimals}})?` : ''}$`)
  return regex.test(amount)
}

export function units(coinsValue: string, decimals: number): string {
  if (!valid(coinsValue, decimals)) throw new Error('Invalid amount')
  let i = coinsValue.indexOf('.')
  if (i < 0) i = coinsValue.length
  const s = coinsValue.slice(i + 1)
  return coinsValue.slice(0, i) + s + '0'.repeat(decimals - s.length)
}

export function coins(unitsValue: string, decimals: number): string {
  if (!valid(unitsValue, 0)) throw new Error('Invalid amount')
  if (decimals === 0) return unitsValue
  const s = unitsValue.padStart(1 + decimals, '0')
  return `${s.slice(0, -decimals)}.${s.slice(-decimals)}`
}

export function formatShortAddress(addressFormat: string): string {
  return `${addressFormat.slice(0, 6)}...${addressFormat.slice(-6)}`
}

export function formatShortAddressDescriptionNft(addressFormat: string): string {
  return `${addressFormat.slice(0, 9)}...`
}

export function formatShortAddressWallet(addressFormat: string): string {
  return `${addressFormat.slice(0, 9)}`
}

export function dollarFormat(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function formatSymbol(tokenSymbol: string) {
  return tokenSymbol.length > 6 ? `${tokenSymbol.substr(0, 6)}...` : tokenSymbol
}

export function formatDomain(domain: string) {
  const domainName = domain?.substr(0, domain.lastIndexOf('.'))
  const domainType = domain?.substr(domain.lastIndexOf('.'))
  const formattedName = domainName.length > 9 ? `${domainName.substr(0, 3)}...${domainName.substr(-3)}` : domainName

  return `${formattedName}${domainType}`
}

export function safeFractionsName(erc20Name: string): string {
  return erc20Name.replace('Shares', 'Fractions').replace('shares', 'fractions')
}

export const imgLH3 = (url: string, size: number): string => {
  return url.includes('https://lh3') ? `${url}=s${size}-c` : url
}
export const safeIpfsUrl = (url: string): string => {
  if (url.includes('ipfs')) {
    return url
  }
  return url
}

export function isAllowedChain(chainId: number): boolean {
  return allowedChains.includes(chainId)
}

