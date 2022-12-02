import { UserLayout } from '@/components/common/layout/UserLayout'
import { env } from '@/env/client.mjs'
import { trpc } from '@/utils/trpc'

export default function Home() {
  const { data, isLoading } = trpc.auth.getMessage.useQuery()
  console.log(data, isLoading)
  console.log(env)
  console.log('skip', process.env.SKIP_ENV_VALIDATION)
  return (
    <UserLayout>
      <h1 className="text-4xl">WELCOME PAGE</h1>
    </UserLayout>
  )
}
