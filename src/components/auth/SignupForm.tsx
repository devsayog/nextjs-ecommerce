import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Input } from '../common/Input'
import { ConfirmEmailMessage } from './ConfirmEmailMessage'

const schema = z.object({
  email: z.string().email(),
})
type IForm = z.infer<typeof schema>

type SignupFormProps = {
  showSignIn: boolean
  handleClose?: () => void
  handleSetSignIn: (b: boolean) => void
}

export function SignupForm({ showSignIn, handleSetSignIn }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IForm>({
    resolver: zodResolver(schema),
  })
  const [emailAdd, setEmailAdd] = useState('')
  const [disabled, setDisabled] = useState(false)

  async function signInwithEmail(values: IForm) {
    let toastId = ''
    try {
      toastId = toast.loading('loading...')
      setDisabled(true)
      await signIn('email', {
        redirect: false,
        callbackUrl: window.location.href,
        ...values,
      })
      setEmailAdd(values.email)
      toast.dismiss(toastId)
    } catch (error) {
      console.error(error)
      toast.error('Unable to sign in', { id: toastId })
    }
  }
  const signInWithGoogle = () => {
    setDisabled(true)
    signIn('google', {
      callbackUrl: window.location.href,
    })
  }

  return (
    <>
      {/* Google auth */}
      <button
        disabled={disabled}
        onClick={() => signInWithGoogle()}
        className="mx-auto flex h-[46px] w-full items-center justify-center space-x-2 rounded-md border p-2 text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-transparent disabled:hover:text-gray-500 dark:border-gray-600 dark:bg-slate-900/50 dark:text-gray-300 dark:hover:bg-slate-700"
      >
        <Image src="/google.svg" alt="Google" width={32} height={32} />
        <span>Sign {showSignIn ? 'in' : 'up'} with Google</span>
      </button>
      <form onSubmit={handleSubmit((values) => signInwithEmail(values))}>
        <Input
          label="Email"
          type="text"
          placeholder="somemail@gmail.com"
          {...register('email')}
          error={errors.email}
        />
        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="primaryBtn mt-6"
        >
          {isSubmitting ? 'Loading...' : `Sign ${showSignIn ? 'in' : 'up'}`}
        </button>
        <p className="mt-2 text-center text-sm text-gray-500">
          {showSignIn ? (
            <>
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                disabled={disabled || isSubmitting}
                onClick={() => {
                  handleSetSignIn(false)
                  reset()
                }}
                className="font-semibold text-rose-500 underline underline-offset-1 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-rose-500"
              >
                Sign up
              </button>
              .
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                disabled={disabled || isSubmitting}
                type="button"
                onClick={() => {
                  handleSetSignIn(true)
                  reset()
                }}
                className="font-semibold text-rose-500 underline underline-offset-1 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-rose-500"
              >
                Log in
              </button>
              .
            </>
          )}
        </p>
        <ConfirmEmailMessage email={emailAdd} isOpen={Boolean(emailAdd)} />
      </form>
    </>
  )
}
