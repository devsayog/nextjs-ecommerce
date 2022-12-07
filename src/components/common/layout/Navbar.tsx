/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-nested-ternary */
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { Fragment, useState } from 'react'
import {
  AiFillCloseCircle,
  AiOutlineMenu,
  AiOutlineShoppingCart,
} from 'react-icons/ai'
import { FaShopify } from 'react-icons/fa'

import { navigation } from '@/appdata/navdata'
import { AuthDialog } from '@/components/auth/AuthDialog'
import { SignupForm } from '@/components/auth/SignupForm'
import { ROLES } from '@/types/enum'
import { classNames } from '@/utils/classNames'
import { generateKey } from '@/utils/generateKey'

import { Account } from './Account'
import { AdminDrawer } from './AdminDrawer'
import { ModeToggle } from './ModeToggle'

export function Navbar() {
  const { data: session, status } = useSession()
  const user = session?.user
  const loadingUser = status === 'loading'
  const [isSignInModalOpen, setSignInModalOpen] = useState(false)
  const [isAdminDrawerOpen, setAdminDrawerOpen] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [open, setOpen] = useState(false)
  function closeAdminDrawer() {
    setAdminDrawerOpen(false)
  }
  function isAdmin() {
    return user?.role !== ROLES.USER
  }
  const router = useRouter()
  return (
    <>
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl dark:bg-slate-900">
                <div className="flex px-4 pt-5 pb-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="navIcons rounded-full transition-transform hover:scale-105"
                  >
                    <AiFillCloseCircle
                      className="rounded-full bg-white text-4xl text-red-600 dark:bg-slate-900 dark:text-red-300"
                      aria-hidden="true"
                    />
                    <span className="sr-only">close menu</span>
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200 dark:border-gray-800">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={generateKey()}
                          className={({ selected }) =>
                            classNames(
                              selected
                                ? 'text-indigo-600 border-indigo-600'
                                : 'text-gray-900 dark:text-gray-300 border-transparent',
                              'flex-1 capitalize whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium',
                              'focus:outline-none focus-visible:-translate-y-1 transition'
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel
                        key={generateKey()}
                        className="space-y-10 px-4 pt-10 pb-8"
                      >
                        <div className="grid grid-cols-2 gap-x-4">
                          {category.featured.map((item) => (
                            <div
                              key={generateKey()}
                              className="group relative text-sm"
                            >
                              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                <img
                                  src={item.imageSrc}
                                  alt={item.imageAlt}
                                  className="object-cover object-center"
                                />
                              </div>
                              <Link
                                href={item.href}
                                className="mt-6 block font-medium capitalize text-gray-900 dark:text-gray-300"
                              >
                                <span
                                  className="absolute inset-0 z-10"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                              <p
                                aria-hidden="true"
                                className="mt-1 text-gray-500 dark:text-gray-400"
                              >
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                        {category.sections.map((section) => (
                          <div key={generateKey()}>
                            <p
                              id={`${category.name}-${section.name}-heading-mobile`}
                              className="font-medium capitalize text-gray-900 dark:text-gray-200"
                            >
                              {section.name}
                            </p>
                            <ul
                              role="list"
                              aria-labelledby={`${category.name}-${section.name}-heading-mobile`}
                              className="mt-6 flex flex-col space-y-6"
                            >
                              {section.items.map((item) => (
                                <li key={generateKey()} className="flow-root">
                                  <Link
                                    href={item.href}
                                    className="-m-2 block p-2 transition  hover:text-indigo-800 dark:hover:text-indigo-400"
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/*  */}
      <header className="fixed z-10 flex h-20 w-full bg-white shadow-lg dark:bg-slate-900 dark:shadow-gray-700/5">
        <nav className="mx-auto flex  w-full max-w-[1400px] flex-1 items-center justify-between px-2 lg:px-8">
          <div className="flex items-center gap-2 md:gap-4">
            {/* FOR ADMIN HAMBURGER MENU */}
            {isAdmin() && router.asPath.includes('dashboard') && (
              <button
                type="button"
                className="navIcons"
                onClick={() => setAdminDrawerOpen(true)}
              >
                <div className="sr-only">open admin menu</div>
                <AiOutlineMenu aria-hidden="true" className="h-6 w-6" />
              </button>
            )}
            {/* FOR User HAMBURGER MENU */}
            <button
              type="button"
              className="fixed bottom-4 left-4 rounded-full bg-slate-900 p-2 drop-shadow-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/75 dark:bg-white dark:focus-visible:ring-white/75 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <div className="sr-only">open admin menu</div>
              <AiOutlineMenu
                aria-hidden="true"
                className="h-6 w-6 text-white dark:text-black"
              />
            </button>

            <Link
              href="/"
              className="rounded-full text-rose-900 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/75 dark:text-rose-600 hover:dark:text-rose-400 dark:focus-visible:ring-white/75"
            >
              <span className="sr-only">e-store logo</span>
              <FaShopify aria-hidden="true" className="h-10 w-10 p-1" />
            </Link>
          </div>
          {/* Flyout menus */}
          <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
            <div className="flex h-full space-x-8">
              {navigation.categories.map((category) => (
                <Popover key={generateKey()} className="flex">
                  {({ open }) => (
                    <>
                      <div className="relative flex">
                        <Popover.Button
                          className={classNames(
                            open
                              ? 'border-indigo-600 text-indigo-600'
                              : 'border-transparent text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 hover:-translate-y-1',
                            'relative z-10 -mb-px flex items-center border-b-2 pt-px tracking-wider font-medium transition-colors duration-200 ease-out capitalize',
                            'focus:outline-none focus-visible:-translate-y-1 transition-all'
                          )}
                        >
                          {category.name}
                        </Popover.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Popover.Panel className="absolute inset-x-0 top-full text-sm">
                          <div
                            className="absolute inset-0 top-1/2 bg-white shadow dark:bg-slate-900"
                            aria-hidden="true"
                          />
                          <div className="relative bg-white dark:bg-slate-900">
                            <div className="mx-auto max-w-7xl px-8">
                              <div className="grid grid-cols-2 gap-y-10 gap-x-8 py-16">
                                <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                  {category.featured.map((item) => (
                                    <div
                                      key={generateKey()}
                                      className="group relative text-base sm:text-sm"
                                    >
                                      <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                        <img
                                          src={item.imageSrc}
                                          alt={item.imageAlt}
                                          className="object-cover object-center"
                                        />
                                      </div>
                                      <Link
                                        href={item.href}
                                        className="mt-6 block font-medium capitalize text-gray-900 dark:text-gray-300"
                                      >
                                        <span
                                          className="absolute inset-0 z-10"
                                          aria-hidden="true"
                                        />
                                        {item.name}
                                      </Link>
                                      <p
                                        aria-hidden="true"
                                        className="mt-1 text-gray-500 dark:text-gray-400"
                                      >
                                        Shop now
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <div className="row-start-1 grid grid-cols-3 gap-y-10 gap-x-8 text-sm">
                                  {category.sections.map((section) => (
                                    <div key={generateKey()}>
                                      <p
                                        id={`${section.name}-heading`}
                                        className="text-base font-medium capitalize text-gray-900 dark:text-gray-100"
                                      >
                                        {section.name}
                                      </p>
                                      <ul
                                        role="list"
                                        aria-labelledby={`${section.name}-heading`}
                                        className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                      >
                                        {section.items.map((item) => (
                                          <li
                                            key={generateKey()}
                                            className="flex"
                                          >
                                            <Link
                                              href={item.href}
                                              className="inline-block transition hover:text-indigo-800 dark:hover:text-indigo-400"
                                            >
                                              {item.name}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              ))}
            </div>
          </Popover.Group>
          {/* Buttons */}
          <ul className="flex items-center gap-1 md:gap-2 2xl:gap-4">
            <li>
              <Account>
                {loadingUser ? (
                  <p>Loading...</p>
                ) : !user ? (
                  <button
                    onClick={() => setSignInModalOpen(true)}
                    className="primaryBtn"
                    type="button"
                  >
                    Sign in
                  </button>
                ) : (
                  <>
                    <p className="capitalize text-gray-900 dark:text-gray-300">
                      <span className="text-rose-500 dark:text-rose-300">
                        welcome!{' '}
                      </span>
                      {user.name ? user.name : user.email?.split('@')[0]}
                    </p>
                    {isAdmin() && (
                      <Link
                        className="text-blue-500 hover:text-blue-800 hover:underline dark:text-blue-300"
                        href="/dashboard"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="primaryBtn"
                      type="button"
                    >
                      Log Out
                    </button>
                  </>
                )}
              </Account>
            </li>
            <li>
              <button type="button" className="navIcons">
                <span className="sr-only">Open Cart</span>
                <AiOutlineShoppingCart className="h-6 w-6" />
              </button>
            </li>
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </header>
      <AuthDialog
        open={isSignInModalOpen}
        handleClose={() => setSignInModalOpen(false)}
        heading={showSignIn ? 'Welcome back!' : 'Create your account'}
      >
        {!showSignIn ? (
          <p className="mt-2 text-center text-base text-gray-500 dark:text-gray-400">
            Please create an account to shop online with us.
          </p>
        ) : null}
        <div className="mt-8 space-y-4">
          <SignupForm
            handleSetSignIn={(b: boolean) => setShowSignIn(b)}
            showSignIn={showSignIn}
            handleClose={() => setSignInModalOpen(false)}
          />
        </div>
      </AuthDialog>
      <AdminDrawer
        open={isAdminDrawerOpen}
        handleChangeDrawer={closeAdminDrawer}
      />
    </>
  )
}
