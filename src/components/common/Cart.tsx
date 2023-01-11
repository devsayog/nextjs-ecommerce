import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Fragment, useState } from 'react'
import {
  AiFillDelete,
  AiOutlineClose,
  AiOutlineMinus,
  AiOutlinePlus,
} from 'react-icons/ai'

import { useCartContext } from '@/context/CartContext'
import { trpc } from '@/utils/trpc'

import { AuthDialog } from '../auth/AuthDialog'
import { SignupForm } from '../auth/SignupForm'

type CartProps = {
  isCartOpen: boolean
  handleCartClose: () => void
}
export function Cart({ isCartOpen, handleCartClose }: CartProps) {
  const { status, data: session } = useSession()
  const loadingUser = status === 'loading'
  const user = session?.user
  const {
    cartItems,
    addCartItem,
    removeCartItem,
    subTotal,
    deleteItemFromCart,
  } = useCartContext()
  const [isSignInModalOpen, setSignInModalOpen] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const checkoutSession = trpc.stripe.checkoutSession.useMutation()
  function handleCheckout() {
    if (!user) {
      setSignInModalOpen(true)
    }
    checkoutSession.mutate(
      { products: cartItems },
      {
        onSettled(data) {
          if (data) {
            window.location.href = data.url
          }
        },
      }
    )
  }
  return (
    <>
      <Transition.Root show={isCartOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCartClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full sm:pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto h-screen w-screen max-w-md">
                    <div className="flex h-full flex-col bg-white shadow-xl dark:bg-slate-900">
                      <div className="sticky top-0 flex items-start justify-between bg-white py-6 px-4  dark:bg-slate-900 sm:px-6">
                        <Dialog.Title className="text-lg font-medium">
                          Shopping cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={handleCartClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <AiOutlineClose
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      {cartItems.length <= 0 ? (
                        <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                          <p className="text-lg font-medium">
                            Please add Items in Cart.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="max-h-[47vh] flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                            <div className="mt-8">
                              <div className="flow-root">
                                <ul
                                  role="list"
                                  className="-my-6 divide-y divide-gray-200 dark:divide-gray-700"
                                >
                                  {cartItems.map((product) => (
                                    <li key={product.id} className="flex py-6">
                                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                        <Image
                                          fill
                                          src={product.images[0] || ''}
                                          alt={product.title}
                                          className="h-full w-full object-cover object-center"
                                        />
                                      </div>

                                      <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                          <div className="flex justify-between text-base font-medium">
                                            <h3>
                                              <Link
                                                href={`/products/${product.slug}`}
                                              >
                                                {product.title}
                                              </Link>
                                            </h3>
                                            <p className="ml-4 font-medium">
                                              $
                                              {product.price * product.quantity}
                                            </p>
                                          </div>
                                          <p className="mt-1 text-sm font-medium">
                                            {product.brand}
                                          </p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                          <div className="flex items-center gap-2">
                                            <p className="font-medium">Qty:</p>
                                            <button
                                              onClick={() =>
                                                removeCartItem(product)
                                              }
                                              type="button"
                                              className="rounded-full bg-red-600 p-1 font-medium text-white hover:bg-red-500"
                                            >
                                              <p className="sr-only">
                                                Remove 1 item
                                              </p>
                                              <AiOutlineMinus
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                              />
                                            </button>
                                            <p className="text-base font-medium">
                                              {product.quantity}
                                            </p>
                                            <button
                                              onClick={() =>
                                                addCartItem(product)
                                              }
                                              type="button"
                                              className="rounded-full bg-indigo-600 p-1 font-medium text-white hover:bg-indigo-500"
                                            >
                                              <p className="sr-only">
                                                Add 1 item
                                              </p>
                                              <AiOutlinePlus
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                              />
                                            </button>
                                          </div>
                                          <div className="flex">
                                            <button
                                              onClick={() =>
                                                deleteItemFromCart(product)
                                              }
                                              type="button"
                                              className="rounded-full p-1 font-medium text-red-600 hover:text-red-500"
                                            >
                                              <p className="sr-only">Remove</p>
                                              <AiFillDelete
                                                aria-hidden="true"
                                                className="h-5 w-5"
                                              />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 py-6 px-4 dark:border-gray-700 sm:px-6">
                            <div className="flex justify-between text-base font-medium">
                              <p>Subtotal</p>
                              <p>${subTotal()}</p>
                            </div>
                            <p className="mt-0.5 text-sm">
                              Shipping and taxes calculated at checkout.
                            </p>
                            <div className="mt-4">
                              <button
                                disabled={
                                  loadingUser || checkoutSession.isLoading
                                }
                                onClick={handleCheckout}
                                className="flex w-full items-center justify-center rounded-md border border-transparent bg-rose-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-rose-700"
                              >
                                Checkout
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <AuthDialog
        open={isSignInModalOpen}
        handleClose={() => setSignInModalOpen(false)}
        heading={showSignIn ? 'Welcome back!' : 'Create your account'}
      >
        {!showSignIn ? (
          <p className="mt-2 text-center text-base text-gray-500 dark:text-gray-400">
            Please create an account or login to shop online with us.
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
