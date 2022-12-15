import { forwardRef } from 'react'
import type { FieldError } from 'react-hook-form'

import { classNames } from '@/utils/classNames'

interface TextareaProps {
  label: string
  placeholder?: string
  error: FieldError | undefined
  disabled?: boolean
  rows: number
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, ...props }, ref) {
    const invalid = error?.message
    return (
      <div className="flex flex-col space-y-2">
        {label ? <label htmlFor={label}>{label}</label> : null}
        <textarea
          aria-describedby={`${label}-error`}
          aria-invalid={invalid ? true : undefined}
          className={classNames(
            'input',
            invalid
              ? 'border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400'
              : 'border-indigo-200 dark:border-indigo-700 focus:border-indigo-400'
          )}
          id={label}
          ref={ref}
          {...props}
        />
        {invalid ? (
          <p
            role="alert"
            id={`${label}-error`}
            className="text-sm text-red-600 first-letter:uppercase"
          >
            {invalid}
          </p>
        ) : null}
      </div>
    )
  }
)
