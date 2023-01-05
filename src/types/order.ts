export type Item = {
  id: string
  image: string
  name: string
  price: number
  quantity: number
  slug: string
}
export type Order = {
  createdAt: Date
  deliveryStatus: string
  email: string
  id: string
  name: string
  shippingCharge: number
  totalAmount: number
  items: Item[]
}
