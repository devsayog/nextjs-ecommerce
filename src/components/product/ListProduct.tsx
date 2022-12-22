import { Fragment, useEffect } from 'react'
import { RiMenuUnfoldFill } from 'react-icons/ri'
import { useInView } from 'react-intersection-observer'

import type { Category } from '@/appdata/navdata'
import { generateKey } from '@/utils/generateKey'
import { trpc } from '@/utils/trpc'

import { BasicProduct } from './BasicProduct'

type ListProductProps = {
  title: string
  handleOpen: () => void
  values: string[]
  category?: Category
}
export function ListProduct({
  title,
  handleOpen,
  values,
  category,
}: ListProductProps) {
  const { ref, inView } = useInView()
  const { isLoading, isError, data, error, fetchNextPage, hasNextPage } =
    trpc.product.getAllProduct.useInfiniteQuery(
      {
        category,
        subSection: values,
      },
      { getNextPageParam: (lastPage) => lastPage.nextId ?? false }
    )
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, inView])
  return (
    <div className="section mx-auto max-w-7xl lg:ml-60">
      <div className="my-2 flex justify-between md:my-4">
        <h2
          id="category-heading"
          className="text-2xl font-extrabold capitalize tracking-wider"
        >
          {title}
        </h2>
        <button
          className="group flex items-center gap-2 rounded bg-gray-300 py-1 px-3 transition hover:scale-105 hover:shadow-md dark:bg-gray-700 lg:hidden"
          onClick={handleOpen}
        >
          <span>Filters</span> <RiMenuUnfoldFill className="h-5 w-5" />
        </button>
      </div>
      {isLoading ? <p>Loading...</p> : null}
      {isError ? <p className="text-red-500">{error.message}</p> : null}
      {/* Product List */}
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {data
          ? data.pages.map((page) => (
              <Fragment key={generateKey()}>
                {page.products.map((product) => (
                  <BasicProduct key={product.id} {...product} />
                ))}
              </Fragment>
            ))
          : null}
        {/* {isFetchingNextPage ? <p>LOADING...</p> : null} */}
        <span style={{ visibility: 'hidden' }} ref={ref}></span>
      </div>
    </div>
  )
}
