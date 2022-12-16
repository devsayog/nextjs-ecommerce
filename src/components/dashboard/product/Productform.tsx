/* eslint-disable @typescript-eslint/no-shadow */
import 'react-quill/dist/quill.snow.css'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Product } from '@prisma/client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import {
  category,
  kidsCategory,
  menCategory,
  section,
  womenCategory,
} from '@/appdata/navdata'
import { Input } from '@/components/common/Input'
import { SelectInput } from '@/components/common/Select'
import { Textarea } from '@/components/common/Textarea'
import type { ProductFormSchemaType } from '@/types/product'
import { productFormSchema } from '@/types/product'
import type { UploadSchema } from '@/types/upload'
import { trpc } from '@/utils/trpc'

import { CancelButton, SubmitButton } from '../common/Buttons'
import { Dropzone } from '../common/Dropzone'

const ReactQuill = dynamic(import('react-quill'), { ssr: false })

interface ProductFormProps extends Product {
  isEditMode: boolean
}

export function Productform(props: Partial<ProductFormProps>) {
  const { images, id, isEditMode, slug, sold, rating } = props
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormSchemaType>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { ...props },
  })
  const [value, setValue] = useState(props.description || '')
  const [values, setValues] = useState<UploadSchema>({
    images: images || [],
    disabled: false,
    error: '',
  })
  const addProduct = trpc.product.add.useMutation()
  const updateProduct = trpc.product.update.useMutation()
  function resetForm() {
    setValues({ images: [], disabled: false, error: '' })
    setValue('')
    reset()
  }

  async function submit(val: ProductFormSchemaType) {
    if (values.images.length < 1) {
      toast.error('Upload an Image')
      return
    }
    if (isEditMode) {
      await updateProduct.mutate(
        {
          ...val,
          images: values.images,
          id: id || '',
          description: value,
          slug: slug || '',
          sold,
          rating,
        },
        {
          onSuccess() {
            toast.success('Product updated successfully')
          },
        }
      )
    } else {
      await addProduct.mutate(
        {
          ...val,
          images: values.images,
          description: value || '',
        },
        {
          onSuccess() {
            toast.success('Produced added.')
            resetForm()
          },
        }
      )
    }
  }

  const [cat, sec] = watch(['category', 'section'])
  function getSubSection() {
    let value: string[] = []
    switch (cat) {
      case 'men':
        value = menCategory.sections.reduce(
          (acc: any, cur) =>
            cur.name === sec ? cur.items.map((c) => c.name) : acc,
          []
        )
        break
      case 'women':
        value = womenCategory.sections.reduce(
          (acc: any, cur) =>
            cur.name === sec ? cur.items.map((c) => c.name) : acc,
          []
        )
        break
      case 'kids':
        value = kidsCategory.sections.reduce(
          (acc: any, cur) =>
            cur.name === sec ? cur.items.map((c) => c.name) : acc,
          []
        )
        break
      default:
        value = []
        break
    }
    return value
  }
  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit((v) => submit(v))}>
      <Input
        error={errors.brand}
        label="Brand"
        placeholder="Brand..."
        type="text"
        {...register('brand')}
      />
      <Input
        error={errors.title}
        label="Title..."
        placeholder="title..."
        type="text"
        {...register('title')}
      />
      <Textarea
        error={errors.metaDescription}
        placeholder="Description fro SEO"
        label="Description for SEO"
        rows={4}
        {...register('metaDescription')}
      />
      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
        <SelectInput
          error={errors.category}
          label="Select Category"
          options={category}
          {...register('category')}
        />
        {cat && !errors.category && (
          <SelectInput
            error={errors.section}
            label="Select Section"
            options={section}
            {...register('section')}
          />
        )}
        {sec && !errors.section && (
          <SelectInput
            error={errors.subSection}
            label="Select Subsection"
            options={getSubSection()}
            {...register('subSection')}
          />
        )}
      </div>
      <div>
        <Dropzone values={values} setValues={setValues} maxImages={5} />
        <p className="mt-1 text-red-400">{values.error}</p>
      </div>
      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          error={errors.oldPrice}
          label="Old Price"
          type="number"
          step="0.01"
          {...register('oldPrice', { valueAsNumber: true })}
        />
        <Input
          error={errors.newPrice}
          label="New Price"
          type="number"
          step="0.01"
          {...register('newPrice', { valueAsNumber: true })}
        />
        <Input
          error={errors.countInStock}
          label="Count in Stock (Quantity)"
          type="number"
          step="1"
          {...register('countInStock', { valueAsNumber: true })}
        />
      </div>
      <div className="quillContainer">
        <p className="p-1.5 font-medium">Product Description</p>
        <ReactQuill
          className="h-full bg-white dark:bg-slate-900"
          theme="snow"
          value={value}
          onChange={setValue}
        />
      </div>
      <div className="flex justify-end gap-4">
        {!isEditMode ? (
          <CancelButton
            click={resetForm}
            disabled={addProduct.isLoading || values.disabled || isSubmitting}
          />
        ) : null}
        <SubmitButton
          text={isEditMode ? 'Update' : 'Submit'}
          disabled={
            addProduct.isLoading ||
            values.disabled ||
            isSubmitting ||
            updateProduct.isLoading
          }
        />
      </div>
    </form>
  )
}
