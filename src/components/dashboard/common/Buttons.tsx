/* eslint-disable @typescript-eslint/no-shadow */

type ButtonProps = {
  click?: () => void
  text?: string
  disabled?: boolean
}

export function SubmitButton({ click, text, disabled }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={click}
      type="submit"
      className="inline-block rounded bg-green-500 px-8 py-2.5 text-sm font-medium capitalize leading-tight text-white ring-green-600 ring-offset-2 transition duration-150 ease-in-out hover:-translate-y-1 hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-2 active:bg-green-700 active:shadow-lg disabled:opacity-50 dark:bg-green-700 dark:text-gray-100 dark:ring-offset-primary dark:hover:bg-green-900 dark:focus:bg-green-800 md:text-base"
    >
      {text || 'Create'}
    </button>
  )
}

export function CancelButton({ click, disabled, text }: ButtonProps) {
  return (
    <button
      onClick={click}
      disabled={disabled}
      type="button"
      className="inline-block rounded border border-yellow-500 px-8 py-2.5 text-sm font-medium capitalize leading-tight text-gray-700 ring-yellow-600 ring-offset-2 transition duration-150 ease-in-out hover:-translate-y-1 hover:border-yellow-600 hover:shadow-lg focus:border-yellow-600 focus:shadow-lg focus:outline-none focus:ring-2 active:border-yellow-700 active:shadow-lg disabled:opacity-50 dark:border-yellow-700 dark:text-gray-300 dark:ring-offset-primary dark:hover:border-yellow-900 dark:focus:border-yellow-800 md:text-base"
    >
      {text ?? 'Cancel'}
    </button>
  )
}
