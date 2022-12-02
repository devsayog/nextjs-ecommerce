import { Popover, Transition } from '@headlessui/react'
import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { AiOutlineUser } from 'react-icons/ai'

import { classNames } from '@/utils/classNames'

type AccountProps = {
  children: ReactNode
}

export function Account({ children }: AccountProps) {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames('navIcons', open && 'opacity-90')}
          >
            <span className="sr-only">user account</span>
            <AiOutlineUser aria-hidden="true" className="h-6 w-6" />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-8 w-screen max-w-[250px] -translate-x-1/2 px-4 sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                <div className="relative grid gap-4 bg-zinc-50 p-2 dark:bg-slate-900 md:p-4 lg:gap-6 lg:p-7">
                  {children}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
