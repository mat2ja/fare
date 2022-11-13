import type { MoneyAccount, CashAccount, Prisma, Transaction } from '@prisma/client'

export type DateRange = {
  from?: string
  to?: string
}

const initalTotal = { income: 0, expense: 0, transferIn: 0, transferOut: 0, net: 0, transferNet: 0, balance: 0 }

export type AccountTotalType = keyof typeof initalTotal

export type CashAccountsQueryModel = DateRange & { transactions?: 'true' | 'false' }

export type CashAccountWithAccount = CashAccount & { account: MoneyAccount }

export type AccountTotals = Record<AccountTotalType, number>

export type CashAccountWithTotals = CashAccount & {
  totals: AccountTotals
}

export type CashAccountWithTotalsAndAccount = CashAccountWithAccount & {
  totals: AccountTotals
}

export type CashAccountWithTotalsAndTransactions = CashAccount & {
  paymentFromAccount: Transaction
  paymentToAccount: Transaction
}

export type CashAccountsBalanceModel = { balance: number; timestamp: Date }

export type GroupedAccount = (Prisma.PickArray<Prisma.TransactionGroupByOutputType, ('type' | 'fromAccountId' | 'toAccountId')[]> & {
  _sum: {
    amount: number | null
  }
})

