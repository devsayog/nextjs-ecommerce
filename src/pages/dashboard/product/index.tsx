import { Menu, Transition } from '@headlessui/react'
import type { ColumnDef } from '@tanstack/react-table'
import type { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { Fragment, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { BsThreeDotsVertical } from 'react-icons/bs'

import { AdminLayout } from '@/components/common/layout/AdminLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { Table } from '@/components/dashboard/common/Table'
import { classNames } from '@/utils/classNames'
import { trpc } from '@/utils/trpc'

export type Product = {
  id: string
  brand: string
  title: string
  category: string
  section: string
  subSection: string
  images: string[]
  oldPrice: number
  newPrice: number
  countInStock: number
}

export default function Index() {
  const router = useRouter()
  const productList = trpc.product.dashboardList.useQuery()
  const deleteProduct = trpc.product.deleteById.useMutation()
  const utils = trpc.useContext()

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'title',
        cell: (props) => (
          <div className="flex items-center gap-2">
            <div className="relative h-24 w-24 bg-cover">
              <Image
                src={props.row.original.images[0] || ''}
                alt={props.row.original.title}
                fill
                sizes="(max-width: 768px) 100vw,
                (max-width: 1200px) 50vw,
                33vw"
                className="rounded bg-cover"
              />
            </div>
            <div className="max-w-[280px]">
              <p className="truncate font-medium tracking-wider lg:text-lg">
                {props.row.original.title}
              </p>
              <p>
                <span className="font-medium tracking-wider">
                  {props.row.original.brand}
                </span>{' '}
                &nbsp; Category:{' '}
                <span className="font-medium tracking-wider">
                  {props.row.original.category}
                </span>
              </p>
              <p>
                section:{' '}
                <span className="font-medium tracking-wider">
                  {props.row.original.section}
                </span>
              </p>
              <p>
                Subsection:{' '}
                <span className="font-medium tracking-wider">
                  {props.row.original.subSection}
                </span>
              </p>
            </div>
          </div>
        ),
      },
      {
        header: 'Stock',
        accessorKey: 'countInStock',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: (props) => <p>{props.row.original.countInStock}</p>,
      },
      {
        header: 'New Price',
        accessorKey: 'newPrice',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: (props) => props.renderValue(),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        enableSorting: false,
        enableColumnFilter: false,
        cell: (props) => (
          <div className="flex justify-center">
            <Menu as="div" className="relative block">
              <Menu.Button className="inline-flex justify-center rounded-full bg-transparent p-1">
                <BsThreeDotsVertical aria-hidden="true" className="text-xl" />
                <p className="sr-only">Actions</p>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 bottom-0 z-10 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-primary">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active
                              ? 'bg-rose-500 text-white'
                              : 'text-gray-900 dark:text-gray-200',
                            'group flex w-full items-center rounded-md p-2 text-sm'
                          )}
                          onClick={() =>
                            router.push(
                              `/dashboard/product/${props.row.original.id}`
                            )
                          }
                        >
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active
                              ? 'bg-rose-500 text-white'
                              : 'text-gray-900 dark:text-gray-200',
                            'group flex w-full items-center rounded-md p-2 text-sm'
                          )}
                          disabled={deleteProduct.isLoading}
                          onClick={() =>
                            deleteProduct.mutate(
                              { id: props.row.original.id },
                              {
                                onSuccess() {
                                  toast.success(
                                    `${props.row.original.title} deleted!!`
                                  )
                                  utils.product.dashboardList.invalidate()
                                },
                              }
                            )
                          }
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        ),
      },
    ],
    [deleteProduct, router, utils.product.dashboardList]
  )
  return (
    <AdminLayout>
      <Meta pageTitle="Product List" />
      <section className="section" aria-labelledby="page-title">
        <h1 id="page-title" className="heading1">
          Product list
        </h1>

        <div className="w-full p-4">
          {productList.isLoading && <Loader />}
          {productList.error && (
            <p className="text-red-500">{productList.error.message}</p>
          )}
          {!productList.isError && !productList.isLoading && (
            <Table columns={columns} data={productList.data || []} />
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
