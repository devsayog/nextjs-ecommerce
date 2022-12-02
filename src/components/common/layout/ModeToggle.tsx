import { MoonIcon, SunIcon } from './ModeToggleIcons'

export function ModeToggle() {
  function disableTransition() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }
  function toggleMode() {
    disableTransition()
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const isSystemDarkMode = darkModeMediaQuery.matches
    const isDarkMode = document.documentElement.classList.toggle('dark')
    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    } else {
      window.localStorage.isDarkMode = isDarkMode
    }
  }
  return (
    <button
      type="button"
      aria-label="toggle dark mode"
      className="group rounded-full bg-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:bg-slate-800/90 dark:ring-white/10 dark:hover:ring-white/20"
      onClick={toggleMode}
    >
      <SunIcon className="h-6 w-6 fill-zinc-100 stroke-zinc-500 transition group-hover:fill-zinc-200 group-hover:stroke-zinc-700 dark:hidden [@media(prefers-color-scheme:dark)]:fill-rose-50 [@media(prefers-color-scheme:dark)]:stroke-rose-500 [@media(prefers-color-scheme:dark)]:group-hover:fill-rose-50 [@media(prefers-color-scheme:dark)]:group-hover:stroke-rose-600" />
      <MoonIcon className="hidden h-6 w-6 fill-zinc-700 stroke-zinc-400 transition dark:block [@media(prefers-color-scheme:dark)]:group-hover:stroke-zinc-300 [@media_not_(prefers-color-scheme:dark)]:fill-teal-400/10 [@media_not_(prefers-color-scheme:dark)]:stroke-teal-500" />
    </button>
  )
}
