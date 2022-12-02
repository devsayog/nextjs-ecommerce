/* eslint-disable no-nested-ternary */
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { AiOutlineMenu, AiOutlineShoppingCart } from 'react-icons/ai'
import { FaShopify } from 'react-icons/fa'

import { ROLES } from '@/types/enum'

import { Account } from './Account'

export function Navbar() {
  const { data: session, status } = useSession()
  const user = session?.user
  const loadingUser = status === 'loading'
  function isAdmin() {
    return user?.role !== ROLES.USER
  }
  const router = useRouter()
  return (
    <>
      <header className="fixed z-10 flex h-20 w-full bg-white shadow-lg dark:bg-slate-900 dark:shadow-gray-700/5">
        <nav className="mx-auto flex  w-full max-w-[1400px] flex-1 items-center justify-between px-2 lg:px-8">
          <div className="flex items-center gap-2 md:gap-4">
            {/* FOR ADMIN HAMBURGER MENU */}
            {isAdmin() && router.asPath.includes('dashboard') && (
              <button type="button">
                <div className="sr-only">open admin menu</div>
                <AiOutlineMenu aria-hidden="true" className="h-6 w-6" />
              </button>
            )}
            {/* FOR User HAMBURGER MENU */}
            {!isAdmin() && (
              <button type="button" className="navIcons">
                <div className="sr-only">open admin menu</div>
                <AiOutlineMenu aria-hidden="true" className="h-6 w-6" />
              </button>
            )}
            <Link
              href="/"
              className="rounded-full text-rose-900 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/75 dark:text-rose-600 hover:dark:text-rose-400 dark:focus-visible:ring-white/75"
            >
              <span className="sr-only">e-store logo</span>
              <FaShopify aria-hidden="true" className="h-10 w-10 p-1" />
            </Link>
          </div>
          <ul className="flex items-center gap-1 md:gap-2 2xl:gap-4">
            <li>
              <Account>
                {loadingUser ? null : !user ? (
                  <button className="primaryBtn" type="button">
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
              <button type="button">
                <p>THEME</p>
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
