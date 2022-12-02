import { Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { HiOutlineMailOpen } from 'react-icons/hi'

type ConfirmEmailMessageProps = {
  email: string
  isOpen: boolean
}

export function ConfirmEmailMessage({
  email,
  isOpen,
}: ConfirmEmailMessageProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <div className="absolute inset-0 z-50 bg-zinc-50 dark:bg-slate-900">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="flex h-full items-center justify-center p-4 lg:p-8">
            <div className="overflow-hidden transition-all">
              <h3 className="text-center text-lg font-medium leading-6 text-gray-900 dark:text-gray-300">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <HiOutlineMailOpen className="h-12 w-12 shrink-0 text-rose-500" />
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  Confirm your email
                </p>
              </h3>

              <p className="mt-4 text-center text-lg text-gray-800 dark:text-gray-400">
                We emailed a magic link to <strong>{email ?? ''}</strong>.
                <br />
                Check your inbox and click the link in the email to login or
                sign up.
              </p>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}
