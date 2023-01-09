import type { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'

import { AdminLayout } from '@/components/common/layout/AdminLayout'
import { Meta } from '@/components/common/Meta'
import { Productform } from '@/components/dashboard/product/Productform'

export default function Create() {
  return (
    <AdminLayout>
      <Meta pageTitle="Add new product" />
      <section className="section" aria-labelledby="page-title">
        <h1 className="heading1">Add new product</h1>
        <Productform />
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
