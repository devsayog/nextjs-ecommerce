import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import superjson from 'superjson'

import type { Category } from '@/appdata/navdata'
import { kidsCategory, menCategory, womenCategory } from '@/appdata/navdata'
import { Meta } from '@/components/common/Meta'
import { ProductCategory } from '@/components/product/ProductCategory'
import { createContext } from '@/server/context'
import { appRouter } from '@/server/router/_app'

export default function Index({
  category,
  categoryList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!categoryList) {
    return null
  }
  return (
    <>
      <Meta pageTitle={`${category} - Most sold products`} />
      <ProductCategory
        mostSold
        category={category as Category}
        categoryList={categoryList}
      />
    </>
  )
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext<{ category: string }>
) {
  const { req, res, params } = ctx
  const category = params?.category || ''
  if (category !== 'men' && category !== 'women' && category !== 'kids') {
    return {
      notFound: true,
    }
  }

  function getCategory() {
    if (category === 'men') {
      return menCategory
    }
    if (category === 'women') {
      return womenCategory
    }
    if (category === 'kids') {
      return kidsCategory
    }
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createContext({ req, res } as any),
    transformer: superjson,
  })
  await ssg.product.getAllProduct.fetch({
    category,
    subSection: [],
    mostSold: true,
  })
  await ssg.product.getAllProduct.fetchInfinite({
    category,
    subSection: [],
    mostSold: true,
  })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      categoryList: getCategory(),
      category,
    },
  }
}
