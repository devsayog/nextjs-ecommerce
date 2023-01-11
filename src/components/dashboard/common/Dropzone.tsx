import Image from 'next/image'
import type { Dispatch, SetStateAction } from 'react'
import type { FileError } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { AiOutlineCheckCircle } from 'react-icons/ai'

import { env } from '@/env/client.mjs'
import type { UploadSchema } from '@/types/upload'
import { classNames } from '@/utils/classNames'
import { generateKey } from '@/utils/generateKey'

import { CancelButton } from './Buttons'

type DropzoneProps = {
  maxImages: number
  setValues: Dispatch<SetStateAction<UploadSchema>>
  values: UploadSchema
}

export function Dropzone({ maxImages, values, setValues }: DropzoneProps) {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragReject,
    isDragAccept,
    isDragActive,
    fileRejections,
    acceptedFiles,
  } = useDropzone({
    accept: { 'image/*': [] },
    maxSize: 5242880,
    minSize: 0,
    maxFiles: maxImages,
    disabled: values.disabled,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onDrop: async (acceptedFiles) => {
      acceptedFiles.map((file) => {
        setValues((prev) => ({ ...prev, disabled: true, error: '' }))
        if (values.images.length >= maxImages) {
          return setValues((prev) => ({
            ...prev,
            disabled: false,
            error: `Only ${maxImages} image will be accepted`,
          }))
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', env.NEXT_PUBLIC_PRESET)
        formData.append('api_key', env.NEXT_PUBLIC_CLOUDINARY_KEY)
        formData.append(
          'timestamp',
          Math.round(new Date().getTime() / 1000).toString()
        )
        fetch(
          `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
          {
            method: 'post',
            body: formData,
          }
        )
          .then((res) => res.json())
          .then((res) => {
            setValues((prev) => ({
              disabled: false,
              images: [...prev.images, res.secure_url],
              error: '',
            }))
            toast.success('Image added successfully')
          })
          .catch((err) => {
            setValues((prev) => ({ ...prev, disabled: false, error: '' }))
            console.error(err)
          })
      })
    },
  })
  function displayErrorMessage() {
    if (fileRejections.length <= 0) return
    let text = ''
    fileRejections.map(({ errors }) => {
      if (errors.length <= 0) return null
      const { code } = errors[0] as FileError
      if (code === 'file-invalid-type') {
        text = 'Only Image is supported.'
      } else if (code === 'too-many-files') {
        text = `You can only upload up to ${maxImages} ${
          maxImages > 1 ? 'images' : 'image'
        }`
      }
    })
    return (
      <p key={generateKey()} className="text-red-400 lg:text-lg">
        {text}
      </p>
    )
  }
  function clearImages() {
    setValues({ images: [], disabled: false, error: '' })
    toast.success('clear images')
  }

  return (
    <div className="space-y-2">
      <div
        className={classNames(
          'flex cursor-pointer flex-1 flex-col items-center rounded border-2 border-dashed border-gray-500  bg-gray-100 p-8 transition-all focus:outline-none focus:ring-4 focus:ring-gray-400  dark:border-gray-400 dark:bg-slate-800',
          isFocused
            ? 'border-gray-300 bg-gray-300 ring-gray-400 dark:bg-slate-700'
            : '',
          isDragReject
            ? 'border-red-400 text-red-800 focus:border-red-400/50 focus:ring-red-400/50 dark:text-red-400'
            : '',
          isDragAccept ? 'border-green-500' : ''
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {!isDragActive && <p>Click here or drop a file to upload!</p>}
        {isDragActive && !isDragReject && <p>Drop it here!</p>}
        {isDragReject && <p>File type not accepted, sorry!</p>}
        {displayErrorMessage()}
      </div>
      <ul className="w-full space-y-2 text-center">
        {values.images.length > 0 &&
          acceptedFiles.length > 0 &&
          acceptedFiles.map((acceptedFile) => (
            <li
              key={generateKey()}
              className="flex items-center justify-center gap-4 bg-green-400 py-1 text-gray-800 dark:bg-green-600 dark:text-gray-200"
            >
              {acceptedFile.name}{' '}
              <AiOutlineCheckCircle className="text-lg text-green-700 dark:text-green-100" />
            </li>
          ))}
      </ul>
      <CancelButton
        text="Clear pics"
        disabled={values.disabled || values.images.length <= 0}
        click={clearImages}
      />
      <div className="flex flex-wrap gap-2 lg:gap-4">
        {values.images.map((image) => (
          <div className="relative flex h-12 w-12" key={generateKey()}>
            <Image src={image} alt="preview image" fill />
          </div>
        ))}
      </div>
    </div>
  )
}
