import type { ROLES as PROLES } from '@prisma/client'
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
import { trpc } from '@/utils/trpc'

type User = {
  id: string
  image: string | null
  name: string | null
  email: string | null
  role: PROLES
  createdAt: Date | null
}
export default function Example() {
  const userList = trpc.user.getAll.useQuery()

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        enableSorting: false,
        enableGlobalFilter: false,
        accessorFn: (row) => row.name,
        cell: (props) => (
          <div className="flex items-center space-x-1">
            <img
              src={props.row.original.image ?? '/unknown.webp'}
              alt={props.row.original.name || 'random'}
              width="50"
              height="50"
              className="rounded-full"
            />
            <span className="whitespace-nowrap">{props.row.original.name}</span>
          </div>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        accessorFn: (row) => row.email,
        cell: (props) => (
          <span className="whitespace-nowrap">{props.row.original.email}</span>
        ),
      },
      {
        header: 'Roles',
        accessorKey: 'registered',
        cell: (props) => (
          <span className="font-medium tracking-wider">
            {props.row.original.role}
          </span>
        ),
      },
      {
        header: 'Created at',
        accessorKey: 'createdAt',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: (props) => (
          <span>
            {props.row.original.createdAt?.toISOString().substring(0, 10)}
          </span>
        ),
      },
      {
        header: 'Details',
        accessorKey: 'details',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: (props) => (
          <Link
            href={`/dashboard/customer/${props.row.original.id}`}
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
      <Meta pageTitle="User list" />
      <section className="section" aria-labelledby="page-title">
        <h1 id="page-title" className="heading1">
          User list
        </h1>
        <div className="w-full p-4">
          {userList.isLoading && <Loader />}
          {userList.error && (
            <p className="text-red-500">{userList.error.message}</p>
          )}
          {!userList.isError && !userList.isLoading && (
            <Table columns={columns} data={userList.data || []} />
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
