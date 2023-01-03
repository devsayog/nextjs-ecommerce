import { Dialog, Transition } from '@headlessui/react'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

type AuthDialogProps = {
  open: boolean
  handleClose: () => void
  children: ReactNode
  heading?: string
}

export function Ratingdialog({
  open,
  handleClose,
  children,
  heading,
}: AuthDialogProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        onClose={handleClose}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm dark:bg-white/5" />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative my-8 inline-block w-full max-w-md overflow-hidden bg-zinc-50 p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900 sm:rounded-md">
              <button
                onClick={handleClose}
                className="float-right rounded-md p-1  transition hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-600/50 dark:hover:bg-slate-800 "
              >
                <span className="sr-only">close sign in modal</span>
                <AiOutlineClose aria-hidden="true" className="h-5 w-5" />
              </button>
              <div className="py-8">
                {heading ? (
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900 dark:text-gray-300"
                  >
                    {heading}
                  </Dialog.Title>
                ) : null}
                <div className="mt-2">{children}</div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
