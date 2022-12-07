/* eslint-disable @typescript-eslint/no-unused-vars */
import { Disclosure } from '@headlessui/react'
import Link from 'next/link'
import { AiFillCloseCircle, AiFillHome } from 'react-icons/ai'
import { BiChevronRight } from 'react-icons/bi'
import { BsPeopleFill } from 'react-icons/bs'
import { FaShopify } from 'react-icons/fa'
import { ImCart } from 'react-icons/im'
import { MdCategory } from 'react-icons/md'

import { classNames } from '@/utils/classNames'
import { generateKey } from '@/utils/generateKey'

export const dahboardLinks = [
  {
    title: 'dashboard',
    links: [
      {
        name: 'overview',
        Icon: AiFillHome,
      },
    ],
  },
]
const manageMentLinks = [
  {
    title: 'management',
    links: [
      {
        name: 'product',
        Icon: ImCart,
        subLinks: ['list', 'create'],
      },
      {
        name: 'order',
        Icon: MdCategory,
        subLinks: ['list'],
      },
      {
        name: 'customer',
        Icon: BsPeopleFill,
        subLinks: ['list'],
      },
    ],
  },
]
type SidenavProps = {
  drawer: boolean
  close: () => void
}
export function Sidenav({ drawer, close }: Partial<SidenavProps>) {
  const linkStyles =
    'focus flex items-center gap-2 rounded py-2 px-3 text-gray-800 transition-all hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-slate-700'
  return (
    <div className="fixed inset-y-0 left-0 h-full w-60 overflow-x-auto bg-white dark:bg-slate-900">
      <div aria-label="sidebar" className="py-8 px-3">
        {drawer && (
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={close}
              className="navIcons rounded-full transition-transform hover:scale-105"
            >
              <AiFillCloseCircle
                className="rounded-full bg-white text-4xl text-red-600 dark:bg-slate-900 dark:text-red-300"
                aria-hidden="true"
              />
              <span className="sr-only">close drawer menu</span>
            </button>
          </div>
        )}
        <Link
          href="/"
          className={classNames(linkStyles, 'hover:-translate-y-1')}
        >
          <FaShopify
            className="text-3xl text-rose-700 dark:text-rose-500"
            aria-hidden="true"
          />{' '}
          <p className="text-lg lg:text-xl">Fashion</p>
        </Link>
        <hr
          aria-hidden="true"
          className="mt-2 border-gray-200 dark:border-gray-700"
        />
        <nav>
          {dahboardLinks.map((item) => (
            <div key={item.title} className="space-y-3 pt-2">
              <p className="mt-4 text-xl font-light uppercase xl:text-2xl">
                {item.title}
              </p>
              <ul className="space-y-2">
                {item.links.map((link) => (
                  <li key={link.name} className="ml-4">
                    <Link
                      className={classNames(linkStyles, 'hover:-translate-y-1')}
                      href={`${
                        link.name.toLowerCase() === 'overview'
                          ? '/dashboard'
                          : `/dashboard/${link.name.toLowerCase()}`
                      }`}
                    >
                      <link.Icon aria-hidden="true" className="text-2xl" />
                      <p className="text-sm font-medium capitalize md:text-base">
                        {link.name}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {manageMentLinks.map((item) => (
            <div key={item.title} className="space-y-3 pt-2">
              <p className="mt-4 text-xl font-light uppercase xl:text-2xl">
                {item.title}
              </p>
              <ul className="space-y-6">
                {item.links.map((link) => (
                  <li key={link.name} className="ml-4">
                    <Disclosure>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full items-center gap-4">
                            <link.Icon
                              aria-hidden="true"
                              className="text-2xl"
                            />
                            <p className="text-sm font-medium capitalize md:text-base">
                              {link.name}
                            </p>
                            <BiChevronRight
                              aria-hidden="true"
                              className={classNames(
                                'text-2xl',
                                open && 'rotate-90'
                              )}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2">
                            <ul>
                              {link.subLinks.map((itm) => (
                                <li key={generateKey()} className="ml-4">
                                  <Link
                                    href={`${
                                      itm === 'list'
                                        ? `/dashboard/${link.name}`
                                        : `/dashboard/${link.name}/${itm}`
                                    }`}
                                    className={classNames(
                                      linkStyles,
                                      'capitalize font-medium tracking-wider'
                                    )}
                                  >
                                    {itm}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
