import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type { GetServerSidePropsContext } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { useState } from 'react'
import superjson from 'superjson'

import { UserLayout } from '@/components/common/layout/UserLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { Ratingdialog } from '@/components/rating/Ratingdialog'
import { Ratingform } from '@/components/rating/Ratingform'
import { createContext } from '@/server/context'
import { appRouter } from '@/server/router/_app'
import { trpc } from '@/utils/trpc'

type Item = {
  id: string
  image: string
  name: string
  price: string
  quantity: string
  slug: string
}
export default function Order() {
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [productId, setProductId] = useState('')
  function handleClose() {
    setProductId('')
    setRatingDialogOpen(false)
  }
  function handleOpen(id: string) {
    setProductId(id)
    setRatingDialogOpen(true)
  }
  const { data, error, isError, isLoading } = trpc.order.getOrders.useQuery()
  return (
    <UserLayout>
      <Meta pageTitle="Order" />
      <div className="section mx-auto max-w-7xl pt-20">
        <section aria-labelledby="page-title" className="mt-8 sm:px-2 lg:px-8">
          <h2
            id="page-title"
            className="text-2xl font-extrabold capitalize tracking-wider"
          >
            Your orders
          </h2>
          <p className="opacity-60">Recent orders</p>
          <div className="mt-4">
            {isLoading ? <Loader /> : null}
            {data && data.length === 0 ? (
              <p className="text-lg">Please order some items</p>
            ) : null}
            {isError ? <p>{error.message}</p> : null}
          </div>
          <div className="mt-4 space-y-8 sm:px-4 lg:px-0">
            {data
              ? data.map((order) => (
                  <div
                    className="mx-auto max-w-sm border-y border-gray-200 shadow-sm dark:border-gray-700 sm:max-w-none sm:rounded-lg sm:border"
                    key={order.id}
                  >
                    <h3 className="sr-only">
                      Order placed on{' '}
                      <time dateTime={order.createdAt.toISOString()}>
                        {order.createdAt.toISOString()}
                      </time>
                    </h3>
                    <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800 sm:gap-0 sm:gap-x-6 sm:p-6">
                      <div className="flex flex-row  items-center gap-2">
                        <p className="font-medium">Order number:</p>
                        <p className="mt-1">{order.id}</p>
                      </div>
                    </header>
                    <article>
                      <div>
                        {order.items.map((item) => {
                          if (!item) return null
                          const itm = item as Item
                          return (
                            <div
                              className="border-t border-gray-300 py-4 px-6 dark:border-gray-700"
                              key={itm.id}
                            >
                              <div className="grid grid-cols-2 items-center gap-2">
                                <Image
                                  src={itm.image}
                                  alt={itm.name}
                                  width="100"
                                  height="100"
                                />
                                <div>
                                  <Link
                                    href={`/products/${itm.slug}`}
                                    className="text-blue-700 transition hover:text-blue-500 dark:text-blue-500 hover:dark:text-blue-700"
                                  >
                                    <p className="text-sm font-medium md:text-base">
                                      {itm.name}
                                    </p>
                                  </Link>
                                  <p className="text-xs font-medium md:text-base">
                                    Quantity: {itm.quantity}
                                  </p>
                                  <p className="text-sm font-medium md:text-base">
                                    ${itm.price}
                                  </p>
                                  <button
                                    onClick={() => handleOpen(itm.id)}
                                    type="button"
                                    className="rounded-md bg-indigo-600 py-1 px-6 text-white shadow transition hover:bg-indigo-400 dark:bg-indigo-400 dark:hover:bg-indigo-600"
                                  >
                                    Review
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </article>
                    <footer className="flex flex-col items-end gap-2 px-6 py-2">
                      <p className="font-medium">Total: ${order.totalAmount}</p>
                      <div>
                        <Link
                          className="rounded bg-indigo-700 py-1.5 px-6 text-white shadow-md transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 dark:bg-indigo-500 hover:dark:bg-indigo-700"
                          href={`/order/${order.id}`}
                        >
                          Details
                        </Link>
                      </div>
                    </footer>
                  </div>
                ))
              : null}
          </div>
        </section>
      </div>
      <Ratingdialog
        handleClose={handleClose}
        open={ratingDialogOpen}
        heading="Review"
      >
        <Ratingform productId={productId} handleClose={handleClose} />
      </Ratingdialog>
    </UserLayout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req, res } = ctx
  const session = await getSession(ctx)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req, res } as any),
    transformer: superjson,
  })
  const orders = await ssg.order.getOrders.fetch()
  if (!orders) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  }
}
