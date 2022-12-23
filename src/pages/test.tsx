import { Tab } from '@headlessui/react'
import { MdStar } from 'react-icons/md'

import { UserLayout } from '@/components/common/layout/UserLayout'
import { generateKey } from '@/utils/generateKey'
import { trpc } from '@/utils/trpc'

const StarIcon = MdStar

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const { data } = trpc.product.productDescription.useQuery({
    slug: 'Navy-Blue-Solid-Bodycon-Midi-Dress',
  })
  if (!data) {
    return
  }
  return (
    <UserLayout>
      <section className="mx-auto mt-24 max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6  w-full max-w-2xl  lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {data.images.map((image) => (
                    <Tab
                      key={generateKey()}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase  hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only">{image}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? 'ring-indigo-500' : 'ring-transparent',
                              'absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none'
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
                {data.images.map((image) => (
                  <Tab.Panel key={generateKey()}>
                    <img
                      src={image}
                      alt={image}
                      className="h-full w-full object-cover object-center sm:rounded-lg"
                    />
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-xl md:text-2xl">
                {data.title}
              </h1>
              <h2 className="text-lg font-medium tracking-wider">
                {data.brand}
              </h2>
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-medium">${data.newPrice}</p>
                  <p className="text-sm line-through opacity-60">
                    ${data.oldPrice}
                  </p>
                </div>
                <h3 className="text-xl font-medium capitalize sm:text-base">
                  {data.category}
                </h3>
                <h3 className="text-xl font-medium capitalize  sm:text-base">
                  {data.section} <span className="font-normal">in</span>{' '}
                  {data.subSection}
                </h3>
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          data.rating > rating
                            ? 'text-indigo-500'
                            : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{data.rating} out of 5 stars</p>
                </div>
              </div>
              <div className="flex">
                <button
                  disabled={data.countInStock <= 0}
                  type="submit"
                  className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium capitalize text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  {data.countInStock <= 0 ? 'Out of stock' : 'Add to cart'}
                </button>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                {/* <div
                  className="prose prose-invert mx-auto space-y-1 text-base prose-headings:text-gray-100 prose-code:rounded prose-code:bg-gray-600 prose-pre:prose-code:bg-gray-50 md:prose-xl"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                /> */}
                <div
                  className="prose prose-invert mx-auto space-y-1 text-base prose-headings:text-gray-800 prose-code:rounded prose-code:bg-gray-600 prose-pre:prose-code:bg-gray-50 prose-headings:dark:text-gray-200 md:prose-xl"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  )
}
