import { client } from '@/lib/hono'
import { convertAmountFromMilliunits } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export const useGetSummary = () => {
 const params = useSearchParams()
 const from = params.get('from') || ''
 const to = params.get('to') || ''
 const accountId = params.get('accountId') || ''

 const query = useQuery({
  // TODO: Check if params needed in key
  queryKey: ['summary', { from, to, accountId }],
  queryFn: async () => {
   const response = await client.api.summary.$get({
    query: { from, to, accountId },
   })
   if (!response.ok) {
    throw new Error('Failed to fetch summary')
   }

   const { data } = await response.json()
   return {
    ...data,
    incomeAmount: convertAmountFromMilliunits(data.incomeAmount),
    expenseAmount: convertAmountFromMilliunits(data.expenseAmount),
    remainingAmount: convertAmountFromMilliunits(data.expenseAmount),
    categories: data.categories.map((category) => ({
     ...category,
     value: convertAmountFromMilliunits(category.value),
    })),
    days: data.categories.map((day) => ({
     ...day,
     income: convertAmountFromMilliunits(day.income),
     expenses: convertAmountFromMilliunits(day.expense),
    })),
   }
  },
 })
 return query
}
