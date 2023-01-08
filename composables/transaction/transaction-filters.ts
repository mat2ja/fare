import { get, set } from '@vueuse/core'
import type { Ref } from 'vue'
import type { TransactionWithCategoryAndCashAccount } from '~~/models/resources'

export const useTransactionFilters = (_transactions: Ref<TransactionWithCategoryAndCashAccount[] | undefined>) => {
  const { monthQuery } = toRefs(useDateRangeStore())

  // Filters
  const searchQuery = ref('')
  const setSearchQuery = (value: string) => set(searchQuery, value)
  const clearSearchQuery = () => set(searchQuery, '')

  watch(monthQuery, clearSearchQuery)

  const search = (transaction: TransactionWithCategoryAndCashAccount) => {
    const match = (str?: string | null) => !!str?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchName = match(transaction.name)
    const matchDescription = match(transaction?.description)
    const matchCategory = match(transaction.category?.name)
    const fromAccount = match(transaction.fromAccount?.account.name)
    const toAccount = match(transaction.toAccount?.account.name)

    const filters = [matchName, matchDescription, matchCategory, fromAccount, toAccount]

    return filters.some(Boolean)
  }

  // Transactions
  const transactions = ref<TransactionWithCategoryAndCashAccount[]>()
  const hasTransactions = computed(() => get(transactions)?.length)

  watch(_transactions, () => {
    set(transactions, get(_transactions))
  }, { immediate: true })

  watchDebounced(searchQuery, () => {
    const filtered = get(_transactions)?.filter(search)
    set(transactions, filtered)
  }, { debounce: 250, maxWait: 1000 })

  return {
    transactions,
    hasTransactions,
    // Filters
    searchQuery,
    setSearchQuery,
    clearSearchQuery,
  }
}
