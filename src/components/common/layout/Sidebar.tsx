import { Sidenav } from './Sidenav'

export function Sidebar() {
  return (
    <div className="relative z-50 shadow-lg">
      <div className="sticky top-0 hidden h-[calc(100vh-80px)] w-60 lg:block">
        <Sidenav />
      </div>
    </div>
  )
}
