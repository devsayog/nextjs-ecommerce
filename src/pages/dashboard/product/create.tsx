import { AdminLayout } from '@/components/common/layout/AdminLayout'
import { Productform } from '@/components/dashboard/product/Productform'

export default function Create() {
  return (
    <AdminLayout>
      <section className="section" aria-labelledby="page-title">
        <h1 className="heading1">Add new product</h1>
        <Productform />
      </section>
    </AdminLayout>
  )
}
