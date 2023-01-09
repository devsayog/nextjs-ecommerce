import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import Image from 'next/image'
import Link from 'next/link'
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

export default function OrderDetails(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
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
  const { data, isError, error, isLoading } =
    trpc.order.getOrderDetails.useQuery({
      id: props.id,
    })
  return (
    <UserLayout>
      <Meta pageTitle="Order Details" />
      <div className="mx-auto max-w-7xl">
        <section aria-labelledby="page-title" className="section pt-24">
          <h2
            id="page-title"
            className="text-2xl font-extrabold capitalize tracking-wider"
          >
            Order details
          </h2>
          {isLoading ? <Loader /> : null}
          {isError ? <p className="text-red-500">{error.message}</p> : null}
          {data ? (
            <div className="mx-auto my-4 max-w-xl rounded border border-gray-300 dark:border-gray-700">
              <header className="bg-gray-300 py-2 px-6 dark:bg-gray-700">
                <p>Order no: {data.id}</p>
              </header>
              <article>
                <div className="my-4 px-6">
                  <p className="font-medium tracking-widest">User Details</p>
                  <dl className="grid grid-cols-2 text-sm tracking-wider sm:text-base">
                    <dt>Name</dt>
                    <dd>{data.name}</dd>
                    <dt>Email</dt>
                    <dd>{data.email}</dd>
                    <dt>Country</dt>
                    <dd>{data.country}</dd>
                    <dt>Address line1</dt>
                    <dd>{data.addressLine1}</dd>
                    <dt>Address line2</dt>
                    <dd>{data.addressLine2}</dd>
                    <dt>City</dt>
                    <dd>{data.city}</dd>
                    <dt>Postal code</dt>
                    <dd>{data.postalCode}</dd>
                    <dt>Phone</dt>
                    <dd>{data.phone}</dd>
                  </dl>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-700">
                  <p className="px-6 font-medium tracking-widest">
                    Ordered Items
                  </p>
                  {data.items.map((item: any) => {
                    if (!item) return null
                    return (
                      <div className="my-4 px-6" key={item.id}>
                        <div className="grid grid-cols-2 items-center gap-2">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width="100"
                            height="100"
                          />
                          <div>
                            <Link
                              href={`/products/${item.slug}`}
                              className="text-blue-700 transition hover:text-blue-500 dark:text-blue-500 hover:dark:text-blue-700"
                            >
                              <p className="text-sm font-medium md:text-base">
                                {item.name}
                              </p>
                            </Link>
                            <p className="text-xs font-medium md:text-base">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm font-medium md:text-base">
                              ${item.price}
                            </p>
                            <button
                              onClick={() => handleOpen(item.id)}
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
                <div className="flex justify-end border-t border-gray-300 font-medium tracking-wider dark:border-gray-700">
                  <dl>
                    <div className="flex gap-2">
                      <dt>Status: </dt>
                      <dd className="text-green-500 dark:text-green-300">
                        {' '}
                        {data.deliveryStatus}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt>Shipping charge: </dt>
                      <dd>$ {data.shippingCharge}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt>Total amount: </dt>
                      <dd>$ {data.totalAmount}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            </div>
          ) : null}
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

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ id: string }>
) {
  const { req, res, params } = ctx
  const id = params?.id || ''
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req, res } as any),
    transformer: superjson,
  })
  await ssg.order.getOrderDetails.fetch({ id })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  }
}
