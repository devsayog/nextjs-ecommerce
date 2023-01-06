import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

import { STATUSES } from '@/appdata/list'
import { AdminLayout } from '@/components/common/layout/AdminLayout'
import { Meta } from '@/components/common/Meta'
import { SelectInput } from '@/components/common/Select'
import { SubmitButton } from '@/components/dashboard/common/Buttons'
import { trpc } from '@/utils/trpc'

const schema = z.object({
  deliveryStatus: z
    .string({ invalid_type_error: 'Please select valid status' })
    .refine((val) => STATUSES.map((c) => c).includes(val as any), {
      message: 'Please select valid status',
    }),
})
type SchemaType = z.infer<typeof schema>

export default function Example() {
  const router = useRouter()
  const utils = trpc.useContext()
  const orderDetails = trpc.order.getOrderDetails.useQuery({
    id: router.query.id as string,
  })
  const updateDeliveryStatus = trpc.order.updateDeliveryStatus.useMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      deliveryStatus: orderDetails.data?.deliveryStatus || '',
    },
  })
  async function submit(val: SchemaType) {
    if (val.deliveryStatus === orderDetails.data?.deliveryStatus) {
      toast.error('Delivery status is not changed')
      return
    }
    await updateDeliveryStatus.mutate(
      {
        id: router.query.id as string,
        ...val,
      },
      {
        onSuccess() {
          toast.success('Changed delivery status')
          utils.order.getOrderDetails.invalidate({
            id: router.query.id as string,
          })
        },
      }
    )
  }
  return (
    <AdminLayout>
      <Meta pageTitle="Order description" />
      <section className="section" aria-labelledby="page-title">
        <h1 id="page-title" className="heading1">
          Order: {router.query.id}
        </h1>
        {orderDetails.isLoading && <p>Loading . . .</p>}
        {orderDetails.error && (
          <p className="text-red-500">{orderDetails.error.message}</p>
        )}
        {orderDetails.data && (
          <div className="mx-auto my-4 max-w-7xl rounded border border-gray-300 dark:border-gray-700">
            <article>
              <div className="my-4 px-6">
                <p className="font-medium tracking-widest">User Details</p>
                <dl className="grid grid-cols-2 text-sm tracking-wider sm:text-base md:grid-cols-4">
                  <dt>Name</dt>
                  <dd>{orderDetails.data.name}</dd>
                  {orderDetails.data.email && (
                    <>
                      {' '}
                      <dt>Email</dt>
                      <dd title={orderDetails.data.email} className="truncate">
                        {orderDetails.data.email}
                      </dd>
                    </>
                  )}
                  <dt>Country</dt>
                  <dd>{orderDetails.data.country}</dd>
                  <dt>Address line1</dt>
                  <dd>{orderDetails.data.addressLine1}</dd>
                  <dt>Address line2</dt>
                  <dd>{orderDetails.data.addressLine2}</dd>
                  <dt>City</dt>
                  <dd>{orderDetails.data.city}</dd>
                  <dt>Postal code</dt>
                  <dd>{orderDetails.data.postalCode}</dd>
                  <dt>Phone</dt>
                  <dd>{orderDetails.data.phone}</dd>
                </dl>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-700">
                <p className="px-6 font-medium tracking-widest">
                  Ordered Items
                </p>
                {orderDetails.data.items.map((item: any) => {
                  if (!item) return null
                  return (
                    <div className="my-4 px-6" key={item.id}>
                      <div className="grid grid-cols-2 items-center gap-2">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width="100"
                          height="100"
                        />
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            className="text-blue-700 transition hover:text-blue-500 dark:text-blue-500 hover:dark:text-blue-700"
                          >
                            <p className="text-sm font-medium md:text-base">
                              {item.name}
                            </p>
                          </Link>
                          <p className="text-xs font-medium md:text-base">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-medium md:text-base">
                            ${item.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <form
                onSubmit={handleSubmit((v) => submit(v))}
                className="space-y-3 border-t border-gray-300 p-2 font-medium tracking-wider dark:border-gray-700"
              >
                <SelectInput
                  error={errors.deliveryStatus}
                  label="Select Status"
                  options={['PENDING', 'SHIPPING', 'SUCCESS', 'CANCELED']}
                  {...register('deliveryStatus')}
                />
                <SubmitButton disabled={isSubmitting} text="Update" />
              </form>
              <div className="flex justify-end border-t border-gray-300 font-medium tracking-wider dark:border-gray-700">
                <dl>
                  <div className="flex gap-2">
                    <dt>Shipping charge: </dt>
                    <dd>$ {orderDetails.data.shippingCharge}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt>Total amount: </dt>
                    <dd className="font-medium">
                      $ {orderDetails.data.totalAmount}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
