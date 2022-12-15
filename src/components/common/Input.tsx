import type { HTMLInputTypeAttribute } from 'react'
import { forwardRef } from 'react'
import type { FieldError } from 'react-hook-form'

import { classNames } from '@/utils/classNames'

interface InputProps {
  label: string
  type: HTMLInputTypeAttribute
  placeholder?: string
  error: FieldError | undefined
  step?: string
  disabled?: boolean
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, type, ...props },
  ref
) {
  const invalid = error?.message
  return (
    <div className="flex flex-col space-y-1.5">
      {label ? <label htmlFor={label}>{label}</label> : null}
      <input
        aria-describedby={`${label}-error`}
        aria-invalid={invalid ? true : undefined}
        className={classNames(
          'input',
          invalid
            ? 'border-red-400 text-red-800 dark:text-red-400 focus:border-red-400/50 focus:ring-red-400/50'
            : 'border-indigo-200 dark:border-indigo-700 focus:border-indigo-400'
        )}
        id={label}
        type={type}
        ref={ref}
        {...props}
      />
      {invalid ? (
        <p
          role="alert"
          id={`${label}-error`}
          className="text-sm text-red-600 first-letter:uppercase dark:text-red-400"
        >
          {invalid}
        </p>
      ) : null}
    </div>
  )
})
