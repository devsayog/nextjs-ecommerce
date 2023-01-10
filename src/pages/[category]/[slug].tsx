import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import superjson from 'superjson'

import { subSection } from '@/appdata/navdata'
import { UserLayout } from '@/components/common/layout/UserLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { BasicProduct } from '@/components/product/BasicProduct'
import { createContext } from '@/server/context'
import { appRouter } from '@/server/router/_app'
import { trpc } from '@/utils/trpc'

export default function Example(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data, error, isError, isLoading } =
    trpc.product.getAllProduct.useQuery({
      category: props.category,
      subSection: [props.slug],
    })
  return (
    <UserLayout>
      <Meta pageTitle={`${props.category}-${props.slug}`} />
      <section aria-labelledby="page-title" className="section pt-24">
        <h2
          id="page-title"
          className="text-2xl font-extrabold capitalize tracking-wider"
        >
          {props.slug}
        </h2>
        {isLoading ? <Loader /> : null}
        {isError ? <p className="text-red-500">{error.message}</p> : null}
        <div className="mx-auto mt-6 grid max-w-sm grid-cols-1 gap-y-10 gap-x-6 sm:max-w-7xl sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data?.products.length === 0 ? (
            <p className="text-lg text-orange-400 md:text-2xl">
              No product added
            </p>
          ) : null}
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

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ category: string; slug: string }>
) {
  const { req, res, params } = ctx
  const category = params?.category || ''
  const s = params?.slug || ''
  const slug = s.charAt(0).toUpperCase().concat(s.slice(1))
  if (
    category !== 'men' &&
    category !== 'women' &&
    category !== 'kids' &&
    slug.includes(subSection as any)
  ) {
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
    category: params?.category,
    subSection: [slug || ''],
  })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      category: params?.category || '',
      slug: slug || '',
    },
  }
}
