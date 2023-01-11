import Image from 'next/image'
import Link from 'next/link'
import { AiFillStar } from 'react-icons/ai'

import { generateKey } from '@/utils/generateKey'

type BasicProductProps = {
  images: string[]
  title: string
  slug: string
  brand: string
  oldPrice: number
  newPrice: number
  rating: number
}

export function BasicProduct(props: BasicProductProps) {
  return (
    <div className="group relative">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md  group-hover:opacity-75 lg:aspect-none lg:h-80">
        <Image
          height={60}
          width={200}
          src={props.images[0] || ''}
          alt={props.title}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <h3 className="mt-4 text-xs sm:text-sm">
        <Link href={`/products/${props.slug}`}>
          <span aria-hidden="true" className="absolute inset-0" />
          {props.title}
        </Link>
      </h3>
      <p className="text-xs font-medium capitalize tracking-widest sm:text-sm">
        {props.brand}
      </p>
      <div className="flex justify-between">
        <p className="text-sm line-through opacity-70">
          <span className="sr-only">Old Price</span> ${props.oldPrice}
        </p>
        <p className="text-xs font-medium sm:text-sm">
          <span className="sr-only">New Price</span> ${props.newPrice}
        </p>
      </div>
      {props.rating < 0 ? (
        <div className="flex justify-between">
          <div className="flex gap-1">
            {Array.from({ length: Math.round(5) }).map(() => (
              <AiFillStar
                aria-hidden="true"
                key={generateKey()}
                className="h-3 w-3 text-yellow-300"
              />
            ))}
          </div>
          <p className="text-xs font-medium sm:text-sm">
            <span className="sr-only">Rating</span>
            {Number(props.rating)}/5
          </p>
        </div>
      ) : null}
    </div>
  )
}
