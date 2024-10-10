'use client'

import { useEffect } from 'react'
import { ThemeProvider, useTheme } from 'next-themes'
import {
  EnvironmentContextProvider,
  MetaMaskProvider,
  OKXProvider,
  WalletContextProvider,
} from 'web3-connect-react'
import { signOut } from '@/actions/actions'
import { useRouter } from 'next/navigation'

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    let media = window.matchMedia('(prefers-color-scheme: dark)')

    function onMediaChange() {
      let systemTheme = media.matches ? 'dark' : 'light'
      if (resolvedTheme === systemTheme) {
        setTheme('system')
      }
    }

    onMediaChange()
    media.addEventListener('change', onMediaChange)

    return () => {
      media.removeEventListener('change', onMediaChange)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  const router = useRouter()
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange>
      <ThemeWatcher />
      <EnvironmentContextProvider isMobile={false} isTest={false}>
        <WalletContextProvider
          session={session}
          providers={[OKXProvider, MetaMaskProvider]}
          onSignedOut={async () => {
            await signOut()
            router.refresh()
          }}
          listenToAccountChanges={false}
          listenToChainChanges={false}
        >
          {children}
        </WalletContextProvider>
      </EnvironmentContextProvider>
    </ThemeProvider>
  )
}
