import type { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import type { ParsedUrlQuery } from 'querystring'

import { AdminLayout } from '@/components/common/layout/AdminLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { Productform } from '@/components/dashboard/product/Productform'
import { trpc } from '@/utils/trpc'

interface IQuery extends ParsedUrlQuery {
  id: string
}
export default function Id() {
  const router = useRouter()
  const { id } = router.query as IQuery
  const product = trpc.product.getById.useQuery({ id: id || '' })
  return (
    <AdminLayout>
      <Meta pageTitle={product.data?.title} />
      <section className="section" aria-labelledby="page-title">
        <h1 className="heading1">Product Description</h1>
        {product.isLoading && <Loader />}
        {product.isError && (
          <p className="text-red-500">{product.error.message}</p>
        )}
        <div className="py-2 lg:py-4">
          {product.isSuccess && (
            <Productform {...product.data} isEditMode={true} />
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
