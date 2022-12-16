import type { ReactNode } from 'react'

type TableContainerProps = {
  children: ReactNode
}

export function TableContainer({ children }: TableContainerProps) {
  return (
    <div className="mt-4 flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-x-hidden shadow ring-1 ring-white/5 md:rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
