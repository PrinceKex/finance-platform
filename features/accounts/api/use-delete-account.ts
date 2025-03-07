import { toast } from 'sonner'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferResponseType } from 'hono'

type ResponseType = InferResponseType<
 (typeof client.api.accounts)[':id']['$delete']
>

export const useDeleteAccount = (id?: string) => {
 const queryClient = useQueryClient()
 const mutation = useMutation<ResponseType, Error>({
  mutationFn: async () => {
   const response = await client.api.accounts[':id']['$delete']({
    param: { id },
   })

   return await response.json()
  },
  onSuccess: () => {
   toast.success('Account deleted')
   queryClient.invalidateQueries({ queryKey: ['account', { id }] })
   queryClient.invalidateQueries({ queryKey: ['accounts'] })
   queryClient.invalidateQueries({ queryKey: ['transactions'] })
   //  TODO: Invalidate summary and transactions
  },
  onError: (error) => {
   toast.error('Failed to delete account')
   console.error(error)
  },
 })
 return mutation
}
