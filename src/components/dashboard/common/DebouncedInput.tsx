import type { InputHTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

type DebouncedInputProps = {
  value: string | number
  label: string
  onChange: (v: string | number) => void
  debounce: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>

export function DebouncedInput({
  value: initialValue,
  onChange,
  label,
  debounce = 400,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue)
  useEffect(() => setValue(initialValue), [initialValue])

  useEffect(() => {
    const timeOut = setTimeout(() => {
      onChange(value)
    }, debounce)
    return () => clearTimeout(timeOut)
  }, [debounce, onChange, value])

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={value}
        {...props}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text here"
        className="flex-1 rounded-full px-6 py-2 pr-10 text-gray-700 focus:outline-none dark:bg-slate-900 dark:text-gray-300"
      />
      <AiOutlineSearch className="-ml-8 h-6 w-6" />
    </div>
    // <div>
    //   <label htmlFor="input" className="sr-only">
    //     {label}
    //   </label>
    //   <input
    //     id="input"
    //     value={value}
    //     {...props}
    //     className="input focus dark:border-gray-700"
    //     onChange={(e) => setValue(e.target.value)}
    //   />
    // </div>
  )
}
