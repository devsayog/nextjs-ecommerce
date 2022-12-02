/* eslint-disable no-nested-ternary */
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { AiOutlineMenu, AiOutlineShoppingCart } from 'react-icons/ai'
import { FaShopify } from 'react-icons/fa'

import { AuthDialog } from '@/components/auth/AuthDialog'
import { SignupForm } from '@/components/auth/SignupForm'
import { ROLES } from '@/types/enum'

import { Account } from './Account'
import { ModeToggle } from './ModeToggle'

export function Navbar() {
  const { data: session, status } = useSession()
  const user = session?.user
  const loadingUser = status === 'loading'
  const [isSignInModalOpen, setSignInModalOpen] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
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
    </>
  )
}
