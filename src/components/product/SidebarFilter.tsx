import type { ChangeEvent } from 'react'

import type {
  KidsCategory,
  MenCategory,
  WomenCategory,
} from '@/appdata/navdata'
import { generateKey } from '@/utils/generateKey'

type SidebarFilterProps = {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  values: string[]
  category: MenCategory | WomenCategory | KidsCategory
}
export function SidebarFilter({
  handleChange,
  values,
  category,
}: SidebarFilterProps) {
  return (
    <aside className="hidden h-full w-60 bg-white pt-20 dark:bg-slate-900 lg:fixed lg:top-0 lg:block">
      <div className="h-full overflow-y-scroll py-8 px-4">
        <h3 className="mb-6 text-lg font-bold tracking-widest">Filters</h3>
        {category.sections.map((section) => (
          <div key={generateKey()}>
            <p
              id={`${section.name}-heading-mobile`}
              className="mt-4 font-medium capitalize text-gray-900 dark:text-gray-200"
            >
              {section.name}
            </p>
            <ul
              role="list"
              aria-labelledby={`${section.name}-heading-mobile`}
              className="mt-4 flex flex-col space-y-2 pl-4"
            >
              {section.items.map((item) => (
                <li key={generateKey()} className="flow-root">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={item.name}
                        name="subSection"
                        type="checkbox"
                        value={item.name}
                        onChange={handleChange}
                        checked={values.includes(item.name)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={item.name} className="font-medium">
                        {item.name}
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  )
}
