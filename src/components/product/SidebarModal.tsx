import { Dialog, Transition } from '@headlessui/react'
import type { ChangeEvent } from 'react'
import { Fragment } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

import type {
  KidsCategory,
  MenCategory,
  WomenCategory,
} from '@/appdata/navdata'
import { generateKey } from '@/utils/generateKey'

type SidebarModalProps = {
  isOpen: boolean
  handleClose: () => void
  category: MenCategory | WomenCategory | KidsCategory
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  values: string[]
}

export function SidebarModal({
  isOpen,
  handleClose,
  category,
  handleChange,
  values,
}: SidebarModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 lg:hidden"
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-0"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-0"
            >
              <Dialog.Panel className="w-full max-w-2xl overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
                <header className="flex justify-between py-1">
                  <h3 className="mb-6 text-lg font-bold tracking-widest">
                    Filters
                  </h3>
                  <button
                    onClick={handleClose}
                    className="-mt-2 grid h-6 w-6 place-content-center rounded-full p-1 text-gray-400 transition hover:bg-red-500 hover:text-white"
                  >
                    <AiOutlineClose aria-hidden="true" className="h-6 w-6" />
                  </button>
                </header>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3">
                  {category.sections.map((section) => (
                    <div key={generateKey()}>
                      <p
                        id={`${section.name}-heading-mobile`}
                        className="mt-4 font-medium capitalize text-gray-900 dark:text-gray-200"
                      >
                        {section.name}
                      </p>
                      <ul
                        role="list"
                        aria-labelledby={`${section.name}-heading-mobile`}
                        className="mt-4 flex flex-col space-y-2 pl-4"
                      >
                        {section.items.map((item) => (
                          <li key={generateKey()} className="flow-root">
                            <div className="flex items-start">
                              <div className="flex h-5 items-center">
                                <input
                                  id={item.name}
                                  name="subSection"
                                  type="checkbox"
                                  value={item.name}
                                  onChange={handleChange}
                                  checked={values.includes(item.name)}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label
                                  htmlFor={item.name}
                                  className="font-medium"
                                >
                                  {item.name}
                                </label>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
