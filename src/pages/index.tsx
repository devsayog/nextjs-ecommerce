import Image from 'next/image'
import Link from 'next/link'

import { UserLayout } from '@/components/common/layout/UserLayout'
import { Meta } from '@/components/common/Meta'

export default function Example() {
  return (
    <UserLayout>
      <Meta />
      {/* Hero section */}
      <div className="relative h-screen bg-gray-900">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dkqnwjdpm/image/upload/v1671427108/doanbhiusm53tcpr8rp0.jpg"
            alt="kid"
            className="h-full w-full object-cover object-center"
            fill
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gray-500 opacity-40 dark:bg-gray-900 dark:opacity-50"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center py-32 px-6 text-center sm:py-64 lg:px-0">
          <h1 className="bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:bg-gradient-to-r dark:from-purple-200 dark:via-purple-400 dark:to-purple-800 lg:text-6xl">
            New arrivals are here
          </h1>
          <p className="mt-4 text-xl text-gray-100 dark:text-gray-200">
            The new arrivals have, well, newly arrived. Check out the latest
            options from our summer small-batch release while they&apos;re still
            in stock.
          </p>
          <Link
            href="/products/new-arrivals"
            className="mt-8 inline-block rounded-full bg-blue-900 px-6 py-3 text-center font-medium capitalize leading-6 text-white shadow transition hover:bg-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 dark:bg-blue-700 dark:hover:bg-blue-900"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>
      {/* Catrgory Section */}
      <section aria-labelledby="category-heading" className="w-full">
        <div className="mx-auto max-w-7xl py-20 px-4 sm:py-28 sm:px-6 lg:px-8">
          <h2
            id="category-heading"
            className="text-2xl font-extrabold tracking-tight"
          >
            Shop by Category
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
            <div className="group aspect-w-2 aspect-h-1 overflow-hidden rounded-lg sm:row-span-2 sm:aspect-h-1 sm:aspect-w-1">
              <Image
                src="https://res.cloudinary.com/dkqnwjdpm/image/upload/v1671092032/lqlha4xpgswlxtxn0xja.webp"
                alt="Men category."
                fill
                className="object-cover object-center group-hover:opacity-75"
              />
              <div
                aria-hidden="true"
                className="bg-gradient-to-b from-transparent  to-white opacity-50 dark:to-black"
              />
              <div className="flex items-end p-6">
                <div>
                  <h3 className="font-semibold">
                    <Link
                      href="/men"
                      className="rounded bg-indigo-400 py-1 px-4 dark:bg-indigo-800"
                    >
                      <span className="absolute inset-0" />
                      Men
                    </Link>
                  </h3>
                  <p aria-hidden="true" className="mt-1 ">
                    Shop now
                  </p>
                </div>
              </div>
            </div>

            <div className="group aspect-w-2 aspect-h-1 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1">
              <Image
                src="https://res.cloudinary.com/dkqnwjdpm/image/upload/v1671427072/zmlqkomvuerta4mfwbuh.jpg"
                alt="Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee."
                fill
                className="object-cover object-center group-hover:opacity-75"
              />
              <div
                aria-hidden="true"
                className="bg-gradient-to-b from-transparent  to-white opacity-50 dark:to-black"
              />
              <div className="flex items-end p-6">
                <div>
                  <h3 className="font-semibold">
                    <Link
                      href="/women"
                      className="rounded bg-indigo-400 py-1 px-4 dark:bg-indigo-800"
                    >
                      <span className="absolute inset-0" />
                      Women
                    </Link>
                  </h3>
                  <p aria-hidden="true" className="mt-1 ">
                    Shop now
                  </p>
                </div>
              </div>
            </div>
            <div className="group aspect-w-2 aspect-h-1 overflow-hidden rounded-lg sm:aspect-h-1 sm:aspect-w-1">
              <Image
                src="https://res.cloudinary.com/dkqnwjdpm/image/upload/v1671427108/doanbhiusm53tcpr8rp0.jpg"
                alt="Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee."
                fill
                className="object-cover object-center group-hover:opacity-75"
              />
              <div
                aria-hidden="true"
                className="bg-gradient-to-b from-transparent to-white opacity-50 dark:to-black"
              />
              <div className="flex items-end p-6">
                <div>
                  <h3 className="font-semibold">
                    <Link
                      href="/kids"
                      className="rounded bg-indigo-400 py-1 px-4 dark:bg-indigo-800"
                    >
                      <span className="absolute inset-0" />
                      Kids
                    </Link>
                  </h3>
                  <p aria-hidden="true" className="mt-1 ">
                    Shop now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </UserLayout>
  )
}
