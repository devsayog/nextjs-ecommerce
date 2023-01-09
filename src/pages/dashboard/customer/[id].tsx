import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import { ROLES } from '@/appdata/list'
import { AdminLayout } from '@/components/common/layout/AdminLayout'
import { Loader } from '@/components/common/Loader'
import { Meta } from '@/components/common/Meta'
import { SelectInput } from '@/components/common/Select'
import type { GetUser } from '@/types/user'
import { getUser } from '@/types/user'
import { trpc } from '@/utils/trpc'

export default function Example() {
  const router = useRouter()
  const utils = trpc.useContext()
  const userDetails = trpc.user.getById.useQuery({
    id: router.query.id as string,
  })
  const updateUserRole = trpc.user.updateUserRole.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GetUser>({
    resolver: zodResolver(getUser),
    defaultValues: {
      role: userDetails.data?.role,
    },
  })
  async function submit(val: GetUser) {
    if (val.role === userDetails.data?.role) {
      toast.error('User role is not changed')
      return
    }
    await updateUserRole.mutate(
      { id: router.query.id as string, ...val },
      {
        onSuccess() {
          toast.success('Changed user role')
          utils.user.getById.invalidate({
            id: router.query.id as string,
          })
        },
      }
    )
  }
  return (
    <AdminLayout>
      <Meta pageTitle="User description" />
      <section className="section" aria-labelledby="page-title">
        <h1 id="page-title" className="heading1">
          User: {router.query.id}
        </h1>
        {userDetails.isLoading && <Loader />}
        {userDetails.error && (
          <p className="text-red-500">{userDetails.error.message}</p>
        )}
        {userDetails.data && (
          <div className="mx-auto my-4 flow-root max-w-7xl rounded border border-gray-300 p-4 dark:border-gray-700">
            <img
              src={userDetails.data.image ?? '/unknown.webp'}
              alt={userDetails.data.name || 'random'}
              width="50"
              height="50"
              className="float-left rounded-full"
            />
            <dl className="grid grid-cols-[max-content,max-content] gap-x-4 space-y-0.5">
              {userDetails.data.name && (
                <>
                  <dt>Name</dt>
                  <dd>{userDetails.data.name}</dd>
                </>
              )}
              <dt>Email</dt>
              <dd className="truncate">{userDetails.data.email}</dd>
              <dt>Created on</dt>
              <dd>
                {userDetails.data.createdAt?.toISOString().substring(0, 10)}
              </dd>
            </dl>
            <form
              onSubmit={handleSubmit((v) => submit(v))}
              className="gap-4 border-t border-gray-300 p-2 font-medium tracking-wider dark:border-gray-700"
            >
              <SelectInput
                label="Roles"
                options={ROLES}
                error={errors.role}
                {...register('role')}
              />
              <button
                disabled={isSubmitting}
                type="submit"
                className="mt-2 max-w-fit self-center rounded-2xl bg-indigo-700 px-4 py-1.5 text-sm text-white transition hover:shadow-lg dark:bg-indigo-500"
              >
                Update
              </button>
            </form>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
