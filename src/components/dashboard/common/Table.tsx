import type { ColumnDef, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'
import type { IconType } from 'react-icons'
import { AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai'
import { CgPlayTrackNext, CgPlayTrackPrev } from 'react-icons/cg'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'

import { classNames } from '@/utils/classNames'

import { DebouncedInput } from './DebouncedInput'
import { TableContainer } from './Tablecontainer'

const PaginationButton = ({
  icon: Icon,
  click,
  disabled,
  ariaText,
}: {
  icon: IconType
  click: () => void
  disabled: boolean
  ariaText: string
}) => (
  <button
    className="rounded bg-gray-400 p-1 transition-all hover:scale-105 hover:text-gray-200 disabled:opacity-50 dark:bg-slate-800"
    type="button"
    onClick={click}
    disabled={disabled}
  >
    <p className="sr-only">{ariaText}</p>
    <Icon aria-hidden="true" className="text-2xl" />
  </button>
)

type TableProps<T> = {
  columns: ColumnDef<T, any>[]
  data: T[]
}

export function Table<T>({ columns, data }: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  return (
    <TableContainer>
      <div className="flex justify-center py-1.5">
        <DebouncedInput
          label="Search by category title"
          debounce={400}
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(value.toString())}
          placeholder="search by title"
        />
      </div>
      <table className="table min-w-full">
        <thead className="table__head">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3">
                  {header.isPlaceholder ? null : (
                    <div
                      className={classNames(
                        'flex items-center space-x-2',
                        header.column.getCanSort() ? 'cursor-pointer' : ''
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: (
                          <>
                            <AiOutlineArrowUp
                              aria-hidden="true"
                              className="text-lg text-green-700 dark:text-green-400"
                            />
                            <p className="sr-only">
                              Sorted by descending order
                            </p>
                          </>
                        ),
                        desc: (
                          <>
                            <AiOutlineArrowDown
                              aria-hidden="true"
                              className="text-lg text-red-700 dark:text-red-400"
                            />
                            <p className="sr-only">Sorted by ascending order</p>
                          </>
                        ),
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="table__body">
          {table.getRowModel().rows.map((row) => (
            <tr className="table__row-body" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className="px-3 py-1" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getPageCount() > 1 && (
        <div className="my-4 flex items-center justify-center gap-2">
          <PaginationButton
            ariaText="go to first page"
            icon={CgPlayTrackPrev}
            click={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          />
          <PaginationButton
            ariaText="go to previous page"
            icon={MdOutlineNavigateBefore}
            click={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
          <p className="text-sm">
            Page{' '}
            <span className="text-base font-bold">
              {table.getState().pagination.pageIndex + 1}
            </span>{' '}
            of{' '}
            <span className="text-base font-bold">{table.getPageCount()}</span>
          </p>
          <PaginationButton
            ariaText="go to next page"
            icon={MdOutlineNavigateNext}
            click={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
          <PaginationButton
            ariaText="go to last page"
            icon={CgPlayTrackNext}
            click={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          />
        </div>
      )}
    </TableContainer>
  )
}
