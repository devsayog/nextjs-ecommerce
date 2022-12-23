import type { ChangeEvent } from 'react'
import { useState } from 'react'

import type {
  Category,
  KidsCategory,
  MenCategory,
  WomenCategory,
} from '@/appdata/navdata'

import { UserLayout } from '../common/layout/UserLayout'
import { ListProduct } from './ListProduct'
import { SidebarFilter } from './SidebarFilter'
import { SidebarModal } from './SidebarModal'

type ProductCategoryProps = {
  categoryList: MenCategory | WomenCategory | KidsCategory
  category: Category
  mostSold?: boolean
}
export function ProductCategory({
  category,
  categoryList,
  mostSold,
}: ProductCategoryProps) {
  const [values, setValues] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    if (!value) return
    if (values.includes(value)) {
      return setValues((prev) => prev.filter((v) => v !== value))
    }
    setValues((prev) => [...prev, value])
  }
  function handleOpen() {
    setIsOpen(true)
  }
  function handleClose() {
    setIsOpen(false)
  }
  return (
    <UserLayout>
      <section aria-labelledby="category-heading" className="h-full pt-20">
        <SidebarFilter
          category={categoryList}
          handleChange={handleChange}
          values={values}
        />
        <ListProduct
          mostSold={mostSold}
          values={values}
          handleOpen={handleOpen}
          category={category}
          title={category}
        />
      </section>
      <SidebarModal
        category={categoryList}
        handleChange={handleChange}
        values={values}
        handleClose={handleClose}
        isOpen={isOpen}
      />
    </UserLayout>
  )
}
