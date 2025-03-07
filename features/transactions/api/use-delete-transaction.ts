import { toast } from 'sonner'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

type ResponseType = InferResponseType<
 (typeof client.api.transactions)[':id']['$delete']
>

export const useDeleteTransaction = (id?: string) => {
 const queryClient = useQueryClient()
 const mutation = useMutation<ResponseType, Error>({
  mutationFn: async () => {
   const response = await client.api.transactions[':id']['$delete']({
    param: { id },
   })

   return await response.json()
  },
  onSuccess: () => {
   toast.success('Transaction deleted')
   queryClient.invalidateQueries({ queryKey: ['transaction', { id }] })
   queryClient.invalidateQueries({ queryKey: ['transactions'] })
   //  TODO: Invalidate summary and transactions
  },
  onError: (error) => {
   toast.error('Failed to delete transaction')
   console.error(error)
  },
 })
 return mutation
}
