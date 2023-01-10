import type { ReactNode } from 'react'

import { Footer } from '../Footer'
import { Navbar } from './Navbar'

type UserLayoutProps = {
  children: ReactNode
}

export function UserLayout({ children }: UserLayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
