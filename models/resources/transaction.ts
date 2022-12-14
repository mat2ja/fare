import type { MoneyAccount, Transaction } from '@prisma/client'
import type { CategoryWithCount } from './category'
import type { TransactionType } from '~~/models/enums'

export type TransactionWithCategoryAndCashAccount = Transaction &
{ category?: CategoryWithCount } &
{
  fromAccount?: { account: MoneyAccount }
  toAccount?: { account: MoneyAccount }
}

export type TransactionTotalMonthly = {
  date: string
  type: Omit<TransactionType, 'Transfer'>
  total: number
}

export type TransactionTotalMonthlyObject = Record<TransactionType, TransactionTotalMonthly[]>

export type TransactionsTotalsPerRange = {
  from: Date | null
  to: Date | null
  income: number
  expense: number
  net: number
}
