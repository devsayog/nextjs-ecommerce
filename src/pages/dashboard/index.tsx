import { AdminLayout } from '@/components/common/layout/AdminLayout'

export default function Dashboard() {
  return (
    <AdminLayout>
      <h1 className="text-3xl">
        This is dashboard page can only be viewed by admin
      </h1>
    </AdminLayout>
  )
}
