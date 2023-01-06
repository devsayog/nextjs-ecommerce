import { AdminLayout } from '@/components/common/layout/AdminLayout'
import { Meta } from '@/components/common/Meta'

export default function Dashboard() {
  return (
    <AdminLayout>
      <Meta pageTitle="Dashboard overview" />
      <h1 className="text-3xl">
        This is dashboard page can only be viewed by admin
      </h1>
    </AdminLayout>
  )
}
