import slugify from 'slugify'

function generateSlug(name: string) {
  return slugify(name, { lower: true })
}

export type Category = 'men' | 'women' | 'kids'
export const category: Category[] = ['men', 'women', 'kids']
export type Section = 'clothing' | 'shoes' | 'accessories'
export const section: Section[] = ['clothing', 'shoes', 'accessories']
export type WomenClothing =
  | 'Dresses'
  | 'Tops'
  | 'T-Shirts'
  | 'Pants'
  | 'Shorts & Skirts'
  | 'Sweaters'
  | 'Jackets'
  | 'Activewear'
export type MenClothing =
  | 'Tops'
  | 'T-Shirts'
  | 'Pants'
  | 'Shorts'
  | 'Sweaters'
  | 'Jackets'
  | 'Activewear'

export const menClothing: MenClothing[] = [
  'Tops',
  'T-Shirts',
  'Pants',
  'Shorts',
  'Sweaters',
  'Jackets',
  'Activewear',
]

export type KidsClothing =
  | 'Dresses'
  | 'Tops'
  | 'T-Shirts'
  | 'Pants'
  | 'Shorts & Skirts'
  | 'Sweaters'
  | 'Jackets'
  | 'Activewear'

export const kidsClothing: KidsClothing[] = [
  'Dresses',
  'Tops',
  'T-Shirts',
  'Pants',
  'Shorts & Skirts',
  'Sweaters',
  'Jackets',
  'Activewear',
]

export const womenClothing: WomenClothing[] = [
  'Dresses',
  'Tops',
  'T-Shirts',
  'Pants',
  'Shorts & Skirts',
  'Sweaters',
  'Jackets',
  'Activewear',
]
export type WomenAccessories =
  | 'Watches'
  | 'Wallets'
  | 'Bags'
  | 'Sunglasses'
  | 'Hats'
  | 'Belts'
export type MenAccessories =
  | 'Watches'
  | 'Wallets'
  | 'Bags'
  | 'Sunglasses'
  | 'Hats'
  | 'Belts'
export type KidsAccessories =
  | 'Watches'
  | 'Wallets'
  | 'Bags'
  | 'Sunglasses'
  | 'Hats'
  | 'Belts'
export const womenAccessories: WomenAccessories[] = [
  'Watches',
  'Wallets',
  'Bags',
  'Sunglasses',
  'Hats',
  'Belts',
]
export const menAccessories: MenAccessories[] = [
  'Watches',
  'Wallets',
  'Bags',
  'Sunglasses',
  'Hats',
  'Belts',
]
export const kidsAccessories: KidsAccessories[] = [
  'Watches',
  'Wallets',
  'Bags',
  'Sunglasses',
  'Hats',
  'Belts',
]
export type WomenShoes =
  | 'Sneakers'
  | 'Boots'
  | 'Flats'
  | 'Sandals'
  | 'Heels'
  | 'Socks'
export type MenShoes =
  | 'Sneakers'
  | 'Boots'
  | 'Casuals'
  | 'Sandals'
  | 'Sports'
  | 'Socks'
export const menShoes: MenShoes[] = [
  'Sneakers',
  'Boots',
  'Casuals',
  'Sandals',
  'Sports',
  'Socks',
]
export type KidsShoes =
  | 'Sneakers'
  | 'Boots'
  | 'Casuals'
  | 'Sandals'
  | 'Heels'
  | 'Socks'
  | 'Sports'
const kidsShoes: KidsShoes[] = [
  'Sneakers',
  'Boots',
  'Casuals',
  'Sandals',
  'Sports',
  'Socks',
  'Heels',
]
export const womenShoes: WomenShoes[] = [
  'Sneakers',
  'Boots',
  'Flats',
  'Sandals',
  'Heels',
  'Socks',
]
const arr = [
  ...womenClothing,
  ...menClothing,
  ...kidsClothing,
  ...womenShoes,
  ...menShoes,
  ...kidsShoes,
  ...womenAccessories,
  ...menAccessories,
  ...kidsAccessories,
]
export const subSection = Array.from(new Set(arr))

type Items<T> = {
  name: T
  href: string
}
export type SectionType<T, K, U> =
  | {
      name: Section
      items: Items<T>[]
    }
  | {
      name: Section
      items: Items<K>[]
    }
  | {
      name: Section
      items: Items<U>[]
    }
export type WomenCategory = {
  name: Category
  featured: { name: string; href: string; imageSrc: string; imageAlt: string }[]
  sections: SectionType<WomenClothing, WomenShoes, WomenAccessories>[]
}

export type MenCategory = {
  name: Category
  featured: { name: string; href: string; imageSrc: string; imageAlt: string }[]
  sections: SectionType<MenClothing, MenShoes, MenAccessories>[]
}
export type KidsCategory = {
  name: Category
  featured: { name: string; href: string; imageSrc: string; imageAlt: string }[]
  sections: SectionType<KidsClothing, KidsShoes, KidsAccessories>[]
}
export const lll = {
  men: {
    clothing: menClothing,
  },
  women: {},
}
export const womenCategory: WomenCategory = {
  name: 'women',
  featured: [
    {
      name: 'New Arrivals',
      href: `${generateSlug('new arrivals')}`,
      imageSrc: '/women.jpg',
      imageAlt: 'Latest Women Dress.',
    },
    {
      name: 'Most sold products',
      href: `${generateSlug('most sold products')}`,
      imageSrc: '/womenSelling.webp',
      imageAlt: 'Top selling women dress.',
    },
  ],
  sections: [
    {
      name: 'clothing',
      items: womenClothing.map((w) => ({
        name: w,
        href: `/women/${generateSlug(w)}`,
      })),
    },
    {
      name: 'shoes',
      items: womenShoes.map((ws) => ({
        name: ws,
        href: `/women/${generateSlug(ws)}`,
      })),
    },
    {
      name: 'accessories',
      items: womenAccessories.map((wa) => ({
        name: wa,
        href: `/women/${generateSlug(wa)}`,
      })),
    },
  ],
}
export const menCategory: MenCategory = {
  name: 'men',
  featured: [
    {
      name: 'New Arrivals',
      href: `${generateSlug('new arrivals')}`,
      imageSrc: '/men.jpg',
      imageAlt: 'Latest Men dress.',
    },
    {
      name: 'Most sold products',
      href: `${generateSlug('most sold products')}`,
      imageSrc: '/menSelling.jpg',
      imageAlt: 'Top Selling Men Dress.',
    },
  ],
  sections: [
    {
      name: 'clothing',
      items: menClothing.map((w) => ({
        name: w,
        href: `/men/${generateSlug(w)}`,
      })),
    },
    {
      name: 'shoes',
      items: menShoes.map((ws) => ({
        name: ws,
        href: `/men/${generateSlug(ws)}`,
      })),
    },
    {
      name: 'accessories',
      items: menAccessories.map((wa) => ({
        name: wa,
        href: `/men/${generateSlug(wa)}`,
      })),
    },
  ],
}
export const kidsCategory: KidsCategory = {
  name: 'kids',
  featured: [
    {
      name: 'New Arrivals',
      href: `${generateSlug('new arrivals')}`,
      imageSrc: '/kids.jpg',
      imageAlt: 'Latest Kids dress',
    },
    {
      name: 'Most sold products',
      href: `${generateSlug('most sold products')}`,
      imageSrc: '/kidSelling.jpg',
      imageAlt: 'Top selling kids dress',
    },
  ],
  sections: [
    {
      name: 'clothing',
      items: kidsClothing.map((w) => ({
        name: w,
        href: `/men/${generateSlug(w)}`,
      })),
    },
    {
      name: 'shoes',
      items: kidsShoes.map((ws) => ({
        name: ws,
        href: `/men/${generateSlug(ws)}`,
      })),
    },
    {
      name: 'accessories',
      items: kidsAccessories.map((wa) => ({
        name: wa,
        href: `/men/${generateSlug(wa)}`,
      })),
    },
  ],
}

export const navigation = {
  categories: [menCategory, womenCategory, kidsCategory],
}
