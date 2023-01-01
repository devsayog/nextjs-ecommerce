import Link from 'next/link'
import { useEffect } from 'react'

import { UserLayout } from '@/components/common/layout/UserLayout'
import { useCartContext } from '@/context/CartContext'

export default function Success() {
  const { clearCart } = useCartContext()
  useEffect(() => {
    clearCart()
  }, [clearCart])
  return (
    <UserLayout>
      <section className="grid h-screen w-full place-content-center">
        <h2 className="mb-4 text-xl md:text-2xl">
          Your order have been placed successfully.
        </h2>
        <Link
          href="/"
          className="flex items-center justify-center rounded-md border border-transparent bg-rose-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-rose-700"
        >
          Continue Shopping
        </Link>
      </section>
    </UserLayout>
  )
}