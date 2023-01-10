import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import superjson from 'superjson'

import { CATEGORY_NEW_ARRIVAL_LIMIT } from '@/appdata/constants'
import { UserLayout } from '@/components/common/layout/UserLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { BasicProduct } from '@/components/product/BasicProduct'
import { createContext } from '@/server/context'
import { appRouter } from '@/server/router/_app'
import { trpc } from '@/utils/trpc'

export default function NewArrivals({
  category,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error, isError, isLoading } =
    trpc.product.getAllProduct.useQuery({
      category,
      limit: CATEGORY_NEW_ARRIVAL_LIMIT,
    })
  return (
    <UserLayout>
      <Meta pageTitle={`${category} - New Arrivals`} />
      <section aria-labelledby="page-title" className="section pt-24">
        <h2
          id="page-title"
          className="text-2xl font-extrabold capitalize tracking-wider"
        >
          {category} new arrival
        </h2>
        {isLoading ? <Loader /> : null}
        {isError ? <p className="text-red-500">{error.message}</p> : null}
        <div className="mx-auto mt-6 grid max-w-sm grid-cols-1 gap-y-10 gap-x-6 sm:max-w-7xl sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data
            ? data.products.map((product) => (
                <BasicProduct key={product.id} {...product} />
              ))
            : null}
        </div>
      </section>
    </UserLayout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req, res, params } = ctx
  const category = params?.category || ''
  if (category !== 'men' && category !== 'women' && category !== 'kids') {
    return {
      notFound: true,
    }
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req, res } as any),
    transformer: superjson,
  })
  await ssg.product.getAllProduct.fetch({
    category,
    limit: CATEGORY_NEW_ARRIVAL_LIMIT,
  })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      category,
    },
  }
}
