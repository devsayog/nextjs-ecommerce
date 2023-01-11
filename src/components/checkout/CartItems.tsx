import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useCartContext } from '@/context/CartContext'

type CartItem = {
  id: string
  title: string
  price: number
  images: string[]
  brand: string
  slug: string
  quantity: number
}
export function CartItems() {
  const { cartItems: cI, subTotal } = useCartContext()
  const [cartItems, setCartItems] = useState<CartItem[]>()

  useEffect(() => {
    if (cI) {
      setCartItems(cI)
    }
  }, [cI])
  if (!cartItems) return null
  return cartItems.length > 0 ? (
    <div>
      <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
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
                          <Link href={`/products/${product.slug}`}>
                            {product.title}
                          </Link>
                        </h3>
                        <p className="ml-4 font-medium">
                          ${product.price * product.quantity}
                        </p>
                      </div>
                      <p className="mt-1 text-sm font-medium">
                        {product.brand}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Qty:</p>
                        <p className="text-base font-medium">
                          {product.quantity}
                        </p>
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
          <p className="mt-0.5 text-sm">
            Shipping and taxes calculated.($5 for shipping)
          </p>
          <p>${subTotal() + 5}</p>
        </div>
      </div>
    </div>
  ) : null
}
