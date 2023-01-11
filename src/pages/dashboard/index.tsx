import type { Product } from '@prisma/client'
import type { SortingState } from '@tanstack/react-table'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { ImCart } from 'react-icons/im'
import { MdCategory, MdOutlineAttachMoney } from 'react-icons/md'
import { SiSalesforce } from 'react-icons/si'

import { AdminLayout } from '@/components/common/layout/AdminLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { OverviewCard } from '@/components/dashboard/common/Overviewcard'
import { TableContainer } from '@/components/dashboard/common/Tablecontainer'
import { trpc } from '@/utils/trpc'

const columnHelper = createColumnHelper<Product>()

const columns = [
  columnHelper.accessor('title', {
    header: 'Name',
    cell: (info) => (
      <figure className="flex items-center space-x-2">
        <div className="relative h-14 w-14 rounded-full">
          <Image
            className="rounded-full object-cover"
            alt={info.getValue()}
            src={info.row.original.images[0] || ''}
            fill
          />
        </div>
        <figcaption>{info.getValue()}</figcaption>
      </figure>
    ),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('newPrice', {
    header: 'Price',
    cell: (info) => `$${info.getValue()}`,
  }),
  columnHelper.accessor('sold', {
    header: 'Sold',
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor((row) => row.newPrice * row.sold, {
    header: 'Sales',
    cell: (info) => `$${info.getValue()}`,
  }),
]

export default function Dashboard() {
  const totalSales = trpc.dashboard.totalSales.useQuery()
  const totalOrders = trpc.dashboard.totalOrders.useQuery()
  const totalProducts = trpc.dashboard.totalProducts.useQuery()
  const totalEarnings = trpc.dashboard.totalEarnings.useQuery()
  const products = trpc.dashboard.mostSoldProducts.useQuery()

  const [sorting, setSorting] = useState<SortingState>([])
  const { getHeaderGroups, getRowModel } = useReactTable({
    data: products.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  })
  return (
    <AdminLayout>
      <Meta pageTitle="Dashboard overview" />
      <section className="section mx-auto max-w-6xl">
        {(totalSales.isLoading ||
          totalEarnings.isLoading ||
          totalOrders.isLoading ||
          totalProducts.isLoading ||
          products.isLoading) && <Loader />}
        <h1 className="mb-4 text-lg sm:text-xl lg:text-2xl 2xl:text-3xl">
          Overview
        </h1>
        {totalSales.isSuccess ||
        totalEarnings.isSuccess ||
        totalOrders.isSuccess ||
        totalProducts.isSuccess ||
        products.isSuccess ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4">
              <OverviewCard
                title="Total earnings"
                money
                Icon={MdOutlineAttachMoney}
                total={totalEarnings.data ? totalEarnings.data / 100 : 0}
              />
              <OverviewCard
                Icon={SiSalesforce}
                title="Total sales"
                total={totalSales.data || 0}
              />
              <OverviewCard
                Icon={ImCart}
                title="Total products"
                total={totalProducts.data || 0}
              />
              <OverviewCard
                Icon={MdCategory}
                title="Total orders"
                total={totalOrders.data || 0}
              />
            </div>
            <div className="my-4 md:my-6 xl:my-8">
              <h2 className="text-2xl font-extrabold capitalize tracking-wider">
                Top selling products
              </h2>
              <div className="w-full px-4">
                <TableContainer>
                  <table className="table">
                    <thead className="table__head">
                      {getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th className="p-3" key={header.id}>
                              <div
                                className={`flex min-w-[70px] items-center space-x-2 ${
                                  header.column.getCanSort()
                                    ? 'cursor-pointer'
                                    : ''
                                }`}
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: (
                                    <>
                                      <AiOutlineArrowUp
                                        aria-hidden="true"
                                        className="text-lg text-green-400"
                                      />
                                      <p className="sr-only">
                                        Sorted by descending order
                                      </p>
                                    </>
                                  ),
                                  desc: (
                                    <>
                                      <AiOutlineArrowDown
                                        aria-hidden="true"
                                        className="text-lg text-red-400"
                                      />
                                      <p className="sr-only">
                                        Sorted by ascending order
                                      </p>
                                    </>
                                  ),
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="table__body">
                      {getRowModel().rows.map((row) => (
                        <tr key={row.id} className="table__row-body">
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="whitespace-nowrap px-3 py-1"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableContainer>
              </div>
            </div>
          </>
        ) : null}
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
