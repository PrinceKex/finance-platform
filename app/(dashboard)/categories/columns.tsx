'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { client } from '@/lib/hono'
import { InferResponseType } from 'hono'
import { Actions } from './actions'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//  id: string
//  amount: number
//  status: 'pending' | 'processing' | 'success' | 'failed'
//  email: string
// }

export type ResponseType = InferResponseType<
 typeof client.api.categories.$get,
 200
>['data'][0]

export const columns: ColumnDef<ResponseType>[] = [
 {
  id: 'select',
  header: ({ table }) => (
   <Checkbox
    checked={
     table.getIsAllPageRowsSelected() ||
     (table.getIsSomePageRowsSelected() && 'indeterminate')
    }
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    aria-label='Select all'
   />
  ),
  cell: ({ row }) => (
   <Checkbox
    checked={row.getIsSelected()}
    onCheckedChange={(value) => row.toggleSelected(!!value)}
    aria-label='Select row'
   />
  ),
  enableSorting: false,
  enableHiding: false,
 },

 {
  accessorKey: 'name',
  //header: 'Email',
  header: ({ column }) => {
   return (
    <Button
     variant='ghost'
     onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
     Name
     <ArrowUpDown className='ml-2 h-4 w-4' />
    </Button>
   )
  },
 },
 {
  id: 'actions',
  cell: ({ row }) => <Actions id={row.original.id} />,
 },
]
