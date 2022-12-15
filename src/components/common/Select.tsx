import { forwardRef } from 'react'
import type { FieldError } from 'react-hook-form'

interface SelectInputProps {
  label: string
  error: FieldError | undefined
  options: string[]
  disabled?: boolean
}
export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  function Select({ label, error, options, disabled, ...props }, ref) {
    const a = error?.message
    return (
      <div>
        <label className="my-2 block capitalize" htmlFor="select">
          {label}
        </label>
        <select
          aria-describedby={`${label}-error`}
          ref={ref}
          disabled={disabled}
          id={label}
          className="input border-indigo-200 dark:border-indigo-700"
          {...props}
        >
          <option
            className="appearance-none  bg-gray-100 capitalize text-gray-800 dark:bg-slate-900 dark:text-gray-300"
            value=""
          >
            {label}
          </option>
          {options.map((option) => (
            <option
              className="appearance-none  bg-gray-100 capitalize text-gray-800 dark:bg-slate-900 dark:text-gray-300"
              value={option}
              key={option}
            >
              {option}
            </option>
          ))}
        </select>
        {error?.message && (
          <p
            role="alert"
            id={`${label}-error`}
            className="mt-1 text-sm tracking-wide text-red-400"
          >
            {a}
          </p>
        )}
      </div>
    )
  }
)
