import type { ReactNode } from 'react'

import { Navbar } from './Navbar'

type UserLayoutProps = {
  children: ReactNode
}
export function UserLayout({ children }: UserLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="pt-20">{children}</main>
    </>
  )
}
