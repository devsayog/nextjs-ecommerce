import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { LS_KEY } from '@/appdata/constants'

type CartItemProps = {
  id: string
  title: string
  price: number
  images: string[]
  brand: string
  slug: string
}
interface CartItem extends CartItemProps {
  quantity: number
}

type CartContextProps = {
  cartItems: CartItem[]
  addCartItem: (v: CartItemProps) => void
  removeCartItem: (v: CartItemProps) => void
  deleteItemFromCart: (v: CartItemProps) => void
  clearCart: () => void
  subTotal: () => number
}
const CartContext = createContext<CartContextProps | undefined>(undefined)
CartContext.displayName = 'CartContext'
type CartContextProviderProps = {
  children: ReactNode
}

export function CartContextProvider({ children }: CartContextProviderProps) {
  function getCartItemFromLs() {
    if (typeof window === 'undefined') return
    const items = localStorage.getItem(LS_KEY)
    if (!items) return
    return JSON.parse(items) as CartItem[]
  }
  const [cartItems, setCartItems] = useState<CartItem[]>(
    getCartItemFromLs() || []
  )

  function setCartItemInLs(items: CartItemProps[]) {
    if (typeof window === 'undefined') return
    return localStorage.setItem(LS_KEY, JSON.stringify(items))
  }

  const addCartItem = useCallback(
    (item: CartItemProps) => {
      const existingCartItem = cartItems.find((c) => c.id === item.id)
      if (existingCartItem) {
        console.log('runnig')
        setCartItems((prev) =>
          prev.map((c) =>
            c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
          )
        )
        return setCartItemInLs(cartItems)
      }

      setCartItems((prev) => [...prev, { ...item, quantity: 1 }])
      return setCartItemInLs(cartItems)
    },
    [cartItems]
  )
  const clearCart = useCallback(() => {
    if (typeof window === 'undefined') return
    setCartItems([])
    localStorage.removeItem(LS_KEY)
  }, [])
  const removeCartItem = useCallback(
    (item: CartItemProps) => {
      const existingCartItem = cartItems.find((c) => c.id === item.id)
      if (!existingCartItem) return
      if (existingCartItem.quantity === 1) {
        setCartItems((prev) => prev.filter((c) => c.id !== item.id))
      }
      setCartItems((prev) =>
        prev.map((c) =>
          c.id === item.id
            ? {
                ...c,
                existingCartItem,
                quantity: existingCartItem.quantity - 1,
              }
            : c
        )
      )
      return setCartItemInLs(cartItems)
    },
    [cartItems]
  )
  const deleteItemFromCart = useCallback(
    (item: CartItemProps) => {
      setCartItems((prev) => prev.filter((c) => c.id !== item.id))
      return setCartItemInLs(cartItems)
    },
    [cartItems]
  )
  const subTotal = useCallback(() => {
    return cartItems.reduce((acc, cur) => acc + cur.quantity * cur.price, 0)
  }, [cartItems])

  const values = useMemo(
    () => ({
      deleteItemFromCart,
      removeCartItem,
      addCartItem,
      cartItems,
      subTotal,
      clearCart,
    }),
    [
      addCartItem,
      cartItems,
      deleteItemFromCart,
      removeCartItem,
      subTotal,
      clearCart,
    ]
  )

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>
}

export function useCartContext() {
  const cartContext = useContext(CartContext)
  if (!cartContext) {
    throw new Error('Cartcontext must be used inside CartContext Propvider')
  }
  return cartContext
}
