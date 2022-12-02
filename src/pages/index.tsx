import { UserLayout } from '@/components/common/layout/UserLayout'
import { trpc } from '@/utils/trpc'

export default function Home() {
  const { data, isLoading } = trpc.auth.getMessage.useQuery()
  console.log(data, isLoading)
  return (
    <UserLayout>
      <h1 className="text-4xl">WELCOME PAGE</h1>
    </UserLayout>
  )
}
