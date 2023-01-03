import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

import { classNames } from '@/utils/classNames'
import { generateKey } from '@/utils/generateKey'
import { trpc } from '@/utils/trpc'

import { Textarea } from '../common/Textarea'
import { SubmitButton } from '../dashboard/common/Buttons'

const schema = z.object({
  message: z.string().min(4, 'Review must be 4 characters long.'),
})
type ISchema = z.infer<typeof schema>
type RatingformProps = {
  handleClose: () => void
  productId: string
}

export function Ratingform({ productId, handleClose }: RatingformProps) {
  const review = trpc.review.add.useMutation()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ISchema>({
    resolver: zodResolver(schema),
  })
  async function submit(val: ISchema) {
    await review.mutate(
      { ...val, rating, productId },
      {
        onSuccess() {
          handleClose()
          toast.success('Rating added')
        },
      }
    )
  }
  return (
    <form onSubmit={handleSubmit((v) => submit(v))} className="space-y-4">
      {review.isError ? (
        <p className="text-red-500">{review.error.message}</p>
      ) : null}
      <div>
        <p>Rating</p>
        {Array.from({ length: 5 }).map((v, i) => (
          <button
            className={classNames(
              'border-none outline-none bg-transparent',
              i + 1 <= ((rating && hover) || hover)
                ? 'dark:text-gray-300 text-gray-800'
                : 'dark:text-gray-700 text-gray-300'
            )}
            type="button"
            key={generateKey()}
            onDoubleClick={() => {
              setRating(0)
              setHover(0)
            }}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(rating)}
            onClick={() => setRating(i + 1)}
          >
            <span className="text-2xl md:text-4xl">&#9733;</span>
          </button>
        ))}
      </div>
      <Textarea
        error={errors.message}
        rows={5}
        placeholder="Review..."
        label="Review"
        {...register('message')}
      />
      <SubmitButton disabled={isSubmitting || review.isLoading} />
    </form>
  )
}
