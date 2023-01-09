import type { ColumnDef } from '@tanstack/react-table'
import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { useMemo } from 'react'
import { AiFillEdit } from 'react-icons/ai'

import { AdminLayout } from '@/components/common/layout/AdminLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { Table } from '@/components/dashboard/common/Table'
import type { Order } from '@/types/order'
import { trpc } from '@/utils/trpc'

const getBgColor = (status: string) => {
  let str = ''
  switch (status.toUpperCase()) {
    case 'PENDING':
      str = 'bg-blue-700'
      break
    case 'SHIPPING':
      str = 'bg-teal-700'
      break
    case 'SUCCESS':
      str = 'bg-green-600'
      break
    case 'CANCELED':
      str = 'bg-red-700'
      break

    default:
      break
  }
  return str
}
export default function Example() {
  const orderList = trpc.order.getAdminOrder.useQuery()
  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        header: 'Id',
        accessorKey: 'id',
        cell: (props) => <p>{props.row.original.id}</p>,
      },
      {
        header: 'Order by',
        accessorKey: 'name',
        cell: (props) => <p>{props.row.original.name}</p>,
      },
      {
        header: 'No. of Items',
        accessorKey: 'items',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: (props) => props.row.original.items.length,
      },
      {
        header: 'Shipping',
        accessorKey: 'shippingCharge',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: (props) => (
          <p>
            {props.row.original.shippingCharge === 0
              ? 'FREE'
              : `$${props.row.original.shippingCharge}`}
          </p>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'deliveryStatus',
        cell: (props) => (
          <p
            className={`max-w-max whitespace-nowrap rounded-2xl py-1 px-3 text-white ${getBgColor(
              props.row.original.deliveryStatus
            )}`}
          >
            {props.row.original.deliveryStatus}
          </p>
        ),
      },
      {
        header: 'Total',
        enableSorting: false,
        enableGlobalFilter: false,
        accessorKey: 'totalAmount',
        cell: (props) => `$${props.renderValue()}`,
      },
      {
        header: 'Details',
        accessorKey: 'details',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: (props) => (
          <Link
            href={`/dashboard/order/${props.row.original.id}`}
            className="flex max-w-max items-center justify-center rounded-full bg-indigo-600 p-1 transition hover:scale-105 dark:bg-indigo-500"
          >
            <AiFillEdit aria-hidden="true" className="h-5 w-5 text-white" />
            <p className="sr-only">Order Details {props.row.original.id}</p>
          </Link>
        ),
      },
    ],
    []
  )
  return (
    <AdminLayout>
      <Meta pageTitle="Order" />
      <section className="section" aria-labelledby="page-title">
        <h1 id="page-title" className="heading1">
          Order list
        </h1>

        <div className="w-full p-4">
          {orderList.isLoading && <Loader />}
          {orderList.error && (
            <p className="text-red-500">{orderList.error.message}</p>
          )}
          {!orderList.isError && !orderList.isLoading && (
            <Table columns={columns} data={(orderList.data as any) || []} />
          )}
        </div>
      </section>
    </AdminLayout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx)
  if (!session || session?.user?.role === 'USER') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    props: {
      redirect: true,
    },
  }
}
