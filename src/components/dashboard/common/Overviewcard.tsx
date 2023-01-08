import type { IconType } from 'react-icons'

interface IOverviewCardProps {
  money?: boolean
  title: string
  total: number
  Icon: IconType
}

export function OverviewCard({
  title,
  total,
  Icon,
  money,
}: IOverviewCardProps) {
  return (
    <div
      aria-label="earinings data"
      className="w-full space-y-2 rounded-md bg-slate-900 p-2 text-gray-300 shadow-2xl sm:space-y-3 md:space-y-4 md:py-6 md:px-4 xl:space-y-6"
    >
      <div className="flex items-center space-x-3">
        <div aria-hidden="true" className="rounded-full bg-purple-700 p-1">
          <Icon
            aria-hidden="true"
            className="rounded-full text-2xl md:text-3xl"
          />
        </div>
        <p className="text-base font-bold capitalize tracking-wider md:text-lg">
          {title}
        </p>
      </div>
      <p className="text-xl md:text-2xl xl:text-3xl">
        {money ? `$${total}` : total}
      </p>
    </div>
  )
}
