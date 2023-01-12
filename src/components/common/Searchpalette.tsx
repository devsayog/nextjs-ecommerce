import { Combobox, Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import type { ChangeEvent } from 'react'
import { Fragment, useMemo, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

import { classNames } from '@/utils/classNames'
import { debounce } from '@/utils/debounce'
import { trpc } from '@/utils/trpc'

type SearchpaletteProps = {
  handleClose: () => void
  isOpen: boolean
}
export function Searchpalette({ handleClose, isOpen }: SearchpaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const { data, isLoading, isError, error } = trpc.product.search.useQuery(
    {
      query,
    },
    {
      enabled: Boolean(query),
    }
  )
  const queryDb = useMemo(() => {
    return debounce((q: string) => {
      const trimmed = q.trim()
      if (!trimmed) {
        return null
      }
      setQuery(trimmed)
    })
  }, [])
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    queryDb(e.target.value)
  }
  return (
    <Transition.Root
      show={isOpen}
      as={Fragment}
      afterLeave={() => setQuery('')}
    >
      <Dialog
        onClose={handleClose}
        className="fixed inset-0 overflow-y-auto p-4 pt-[20vh]"
      >
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-900/40  backdrop-blur-sm dark:bg-gray-800/30" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Combobox
            onChange={(slug: String) => {
              router.push(`/products/${slug}`)
              handleClose()
            }}
            as="div"
            className="relative mx-auto max-w-xl divide-y divide-gray-300 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-white/10 dark:divide-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center px-4">
              <AiOutlineSearch className="h-6 w-6 " />
              <Combobox.Input
                onChange={handleChange}
                className="h-12 w-full border-0 bg-transparent text-sm focus:ring-0 md:text-base xl:text-lg"
                placeholder="Search"
              />
            </div>
            {!data && query.trim() && !isLoading && (
              <h3 className="text-center text-xl md:text-2xl">
                No results found
              </h3>
            )}
            {isError && (
              <p className="text-center text-red-500">{error.message}</p>
            )}
            {data && query.trim() && (
              <Combobox.Options static className="max-h-96 overflow-y-auto">
                {data.map((prod) => (
                  <Combobox.Option value={prod.slug} key={prod.id}>
                    {({ active }) => (
                      <div
                        className={classNames(
                          'flex items-center px-4 py-2 transition',
                          active
                            ? 'bg-indigo-500 dark:bg-indigo-800 text-gray-200'
                            : ''
                        )}
                      >
                        <div className="relative h-16 w-16 rounded-full ">
                          <Image
                            className="rounded-full"
                            fill
                            src={prod.images[0] || ''}
                            alt={prod.title || ''}
                          />
                        </div>
                        <div className="basis-full pl-5">
                          <h3 className="text-lg md:text-xl">{prod.title}</h3>
                          <div className="flex space-x-5">
                            <p className="font-medium capitalize">
                              {prod.category}
                            </p>
                            <p className="font-medium capitalize">
                              {prod.brand}
                            </p>
                            <p className="font-medium capitalize">
                              {prod.subSection}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </Combobox>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}
