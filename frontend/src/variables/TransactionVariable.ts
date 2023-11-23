import { makeVar } from '@apollo/client'

// eslint-disable-next-line no-shadow
export enum TransactionType {
  mint = 'mint'
}

export type Transaction = {
  hash: string
  type: TransactionType
  params?: TransactionParams
  confirmed: boolean
}

export type TransactionParams = {
  address?: string
}

export const transactionModalVar = makeVar<boolean>(false)
export const transactionLoadingVar = makeVar<boolean>(false)
export const transactionVar = makeVar<Transaction | undefined>(undefined)

export const handleTransaction = (hash: string, type: TransactionType, params?: TransactionParams) => {
  const transaction: Transaction = { hash, type, params, confirmed: false }
  transactionVar(transaction)
  transactionLoadingVar(true)
  transactionModalVar(true)
}

export const clearTransaction = () => {
  transactionVar(undefined)
  transactionLoadingVar(false)
  transactionModalVar(false)
}
