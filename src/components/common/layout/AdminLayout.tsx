import type { ReactNode } from 'react'

import { Footer } from '../Footer'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

type LayoutProps = {
  children: ReactNode
}
export function AdminLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <div className="pt-20 lg:grid lg:grid-cols-[auto,minmax(0,1fr)]">
        <Sidebar />
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
