import { toast } from 'sonner'
import { client } from '@/lib/hono'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { InferRequestType, InferResponseType } from 'hono'

type ResponseType = InferResponseType<typeof client.api.transactions.$post>
type RequestType = InferRequestType<
 typeof client.api.transactions.$post
>['json']

export const useCreateTransaction = () => {
 const queryClient = useQueryClient()
 const mutation = useMutation<ResponseType, Error, RequestType>({
  mutationFn: async (json) => {
   const response = await client.api.transactions.$post({ json })

   return await response.json()
  },
  onSuccess: () => {
   toast.success('Transaction created')
   queryClient.invalidateQueries({ queryKey: ['transactions'] })
   //  TODO: Invalidate Summary
  },
  onError: (error) => {
   toast.error('Failed to create transaction')
   console.error(error)
  },
 })
 return mutation
}
