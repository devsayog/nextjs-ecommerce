import { Header } from '@/components/common/Header'
import { trpc } from '@/utils/trpc'

export default function Home() {
  const { data, isLoading } = trpc.auth.getMessage.useQuery()
  console.log(data, isLoading)
  return (
    <div className="mx-auto max-w-md">
      <Header />
      <h1 className="text-4xl">Hello</h1>
    </div>
  )
}
