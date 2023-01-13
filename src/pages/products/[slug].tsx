import { Tab } from '@headlessui/react'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { MdStar } from 'react-icons/md'
import superjson from 'superjson'

import { UserLayout } from '@/components/common/layout/UserLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { useCartContext } from '@/context/CartContext'
import { createContext } from '@/server/context'
import { appRouter } from '@/server/router/_app'
import { classNames } from '@/utils/classNames'
import { generateKey } from '@/utils/generateKey'
import { trpc } from '@/utils/trpc'

export default function Example(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { addCartItem } = useCartContext()
  const { data, isLoading, isError, error } =
    trpc.product.productDescription.useQuery({
      slug: props.slug,
    })
  if (!data) {
    return
  }
  function handleCartItemAdd() {
    if (!data) return
    addCartItem({
      id: data.id,
      title: data.title,
      price: data.newPrice,
      images: data.images,
      brand: data.brand,
      slug: data.slug,
    })
    toast.success(`${data.title} added in cart.`)
  }
  return (
    <UserLayout>
      <Meta description={data.metaDescription} pageTitle={data.title} />
      <section className="mx-auto mt-24 max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
        {isLoading ? <Loader /> : null}
        {isError ? <p className="text-red-500">{error.message}</p> : null}
        {data ? (
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <Tab.Group as="div" className="flex flex-col-reverse">
                <div className="mx-auto mt-6  w-full max-w-2xl  lg:max-w-none">
                  <Tab.List className="grid grid-cols-4 gap-6">
                    {data.images.map((image) => (
                      <Tab
                        key={generateKey()}
                        className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase  hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4"
                      >
                        {({ selected }) => (
                          <>
                            <span className="sr-only">
                              Image of {data.title}
                            </span>
                            <span className="absolute inset-0 overflow-hidden rounded-md">
                              <Image
                                width="300"
                                height="300"
                                src={image}
                                alt={data.title}
                                className="h-full w-full object-cover object-center"
                              />
                            </span>
                            <span
                              className={classNames(
                                selected
                                  ? 'ring-indigo-500'
                                  : 'ring-transparent',
                                'absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none'
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Tab>
                    ))}
                  </Tab.List>
                </div>
                <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
                  {data.images.map((image) => (
                    <Tab.Panel key={generateKey()}>
                      <Image
                        width="800"
                        height="700"
                        src={image}
                        alt={data.title}
                        className="h-full w-full object-cover object-center sm:rounded-lg"
                      />
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>

              {/* Product info */}
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <h1 className="text-xl font-extrabold tracking-tight  md:text-2xl xl:text-3xl">
                  {data.title}
                </h1>
                <h2 className="font-medium tracking-wider md:text-lg">
                  {data.brand}
                </h2>
                <div className="mt-3">
                  <h2 className="sr-only">Product information</h2>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-medium md:text-xl">
                      ${data.newPrice}
                    </p>
                    <p className="text-lg line-through opacity-60 md:text-xl">
                      ${data.oldPrice}
                    </p>
                  </div>
                  <h3 className="font-medium capitalize md:text-xl">
                    {data.category}
                  </h3>
                  <h3 className="font-medium capitalize md:text-xl">
                    {data.section} <span className="font-normal">in</span>{' '}
                    {data.subSection}
                  </h3>
                </div>

                {/* Reviews */}
                <div className="mt-3">
                  <h3 className="sr-only">Reviews</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <MdStar
                          key={rating}
                          className={classNames(
                            data.rating > rating
                              ? 'text-yellow-500'
                              : 'text-gray-300',
                            'h-5 w-5 flex-shrink-0'
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="sr-only">{data.rating} out of 5 stars</p>
                  </div>
                </div>
                <div className="mt-2 flex">
                  <button
                    disabled={data.countInStock <= 0}
                    onClick={handleCartItemAdd}
                    type="submit"
                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-rose-600 py-3 px-8 text-base font-medium capitalize text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  >
                    {data.countInStock <= 0 ? 'Out of stock' : 'Add to cart'}
                  </button>
                </div>

                <div className="mt-6">
                  <h3 className="sr-only">Description</h3>
                  <div
                    className="prose prose-invert mx-auto prose-headings:text-gray-900 prose-p:text-gray-800 prose-a:text-blue-800 prose-code:rounded prose-code:bg-gray-600 prose-pre:prose-code:bg-gray-50 prose-ol:text-gray-800 prose-ul:text-gray-800 prose-headings:dark:text-gray-100 prose-p:dark:text-gray-300
                  prose-a:dark:text-blue-300 prose-ol:dark:text-gray-300  prose-ul:dark:text-gray-300"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                  />
                </div>
              </div>
              <article className="px-4 py-5">
                <h3 className="text-lg font-medium tracking-wider md:text-xl">
                  Rating
                </h3>
                {data.review.length < 1 ? (
                  <p className="my-4 font-medium tracking-wider">No review</p>
                ) : null}
                {data.review.map((review, reviewIdx) => (
                  <div
                    key={review.id}
                    className="flex space-x-4 text-sm text-gray-500"
                  >
                    <div className="flex-none py-5">
                      <div className="relative h-10 w-10 rounded-full bg-gray-100">
                        <Image
                          fill
                          src="/unknown.webp"
                          alt="user profile picture"
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    <div
                      className={classNames(
                        reviewIdx === 0
                          ? ''
                          : 'border-t border-gray-300 dark:border-gray-700',
                        'flex-1 py-5'
                      )}
                    >
                      <h3 className="font-medium">{review.user.email}</h3>
                      <p>
                        <time dateTime={review.createdAt.toISOString()}>
                          {review.createdAt.toISOString().substring(0, 10)}
                        </time>
                      </p>

                      <div className="mt-4 flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <MdStar
                            key={rating}
                            className={classNames(
                              review.rating > rating
                                ? 'text-yellow-500'
                                : 'text-gray-300',
                              'h-5 w-5 flex-shrink-0'
                            )}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="sr-only">{review.rating} out of 5 stars</p>
                      <p>{review.message}</p>
                    </div>
                  </div>
                ))}
              </article>
            </div>
          </div>
        ) : null}
      </section>
    </UserLayout>
  )
}
export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ slug: string }>
) {
  const { req, res, params } = ctx
  const slug = params?.slug || ''

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req, res } as any),
    transformer: superjson,
  })
  await ssg.product.productDescription.fetch({
    slug,
  })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  }
}
