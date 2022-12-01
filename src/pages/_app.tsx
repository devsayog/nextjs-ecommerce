import '../styles/globals.css'

import type { AppType } from 'next/app'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

import { trpc } from '@/utils/trpc'

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster
        toastOptions={{
          className: 'background',
        }}
      />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)
