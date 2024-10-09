import { cloneElement, useCallback, useState } from 'react'
import {
  AvailableProvider,
  useWallet,
  WalletProvider,
} from 'web3-connect-react'

interface Props {
  closeModal: () => void
}

/**
 * Return a string with length characters from the start and end of the content.
 * The middle characters are replaced with an ellipsis.
 * @param content The content to shorten
 * @param length number of characters to keep from the start and end
 */
export function omitMiddle(content: string, length: number) {
  if (content.length <= length * 2) return content
  return `${content.slice(0, length)}...${content.slice(-length)}`
}

function WalletItem({
  provider,
  closeModal,
}: {
  provider: WalletProvider
  closeModal: () => void
}) {
  const Image = cloneElement(provider.metadata.image as any, {
    className: 'rounded-lg p-1',
  })

  const { sdk, signIn } = useWallet()
  const [isLoading, setIsLoading] = useState(false)

  const onSignIn = useCallback(
    async (provider: AvailableProvider) => {
      setIsLoading(true)
      await signIn(provider, {
        onSignedIn: async (walletAddress, provider, session) => {
          sessionStorage.setItem('session', JSON.stringify(session))
        },
        getSignInData: async (address, provider) => {
          return {}
        },
      })
        .catch((e) => {
          alert(e.message)
        })
        .finally(() => {
          setIsLoading(false)
        })
    },
    [sdk],
  )

  const handleClick = () => {
    if (!provider.isEnabled(sdk.walletProviders)) {
      console.log(provider.metadata)
      if (provider.metadata.name.toLowerCase() === 'okx') {
        window.open('https://www.okx.com/zh-hans/download')
      } else {
        window.open('https://metamask.io/')
      }
      closeModal()
    } else {
      onSignIn(provider.metadata.name)
    }
  }

  return (
    <li key={provider.metadata.name} className={'h-[80px] w-full'}>
      <button
        // disabled={!provider.isEnabled(sdk.walletProviders)}
        onClick={handleClick}
        className={
          'flex h-full w-full flex-row items-center rounded-[10px] bg-[#D1D5DB] bg-opacity-30 p-[15px] pb-[15px] pl-5 pr-[35px] hover:bg-opacity-50 disabled:cursor-not-allowed'
        }
      >
        <div className={'flex w-full flex-row justify-between'}>
          <div className={'flex flex-row items-center space-x-2'}>
            <div
              className={`h-6 w-6 rounded-lg ${provider.metadata.name === 'MetaMask' ? 'bg-[#EAE0D7]' : 'bg-black'}`}
            >
              {Image}
            </div>
            <label className={'text-sm font-bold text-[#111827]'}>
              {provider.metadata.name} Wallet
            </label>
          </div>
          {isLoading && <div className={'absolute right-5'}></div>}
          {!provider.isEnabled(sdk.walletProviders) ? (
            <div
              className={'text-sm text-[#A0A8C0]'}
              style={{
                border: '1px solid #A0A8C0',
                padding: '3px 8px',
                borderRadius: 8,
              }}
            >
              not installed
            </div>
          ) : null}
        </div>
      </button>
    </li>
  )
}

export function ConnectWalletModal({ closeModal }: Props) {
  const { sdk, isSignedIn, walletAddress, signOut } = useWallet()

  return (
    <div className={'flex flex-col items-center justify-center p-8'}>
      <div className={'mx-auto w-full space-y-5'}>
        <button
          className={'absolute right-10 top-10'}
          onClick={() => {
            closeModal()
          }}
        >
          <div>close</div>
        </button>
        {!isSignedIn && (
          <img
            src={'/assets/logo1.png'}
            alt={'logo'}
            className={'mx-auto'}
            width={90}
            height={35}
          />
        )}
        {!isSignedIn && (
          <>
            <h1 className={'text-center text-2xl font-bold text-[#111827]'}>
              Sign In To WYT
            </h1>
            <p className={'text-left text-sm font-normal text-[#6B7280]'}>
              Get started with your wallet. By signing in to WYT, you agree to
              our Terms of Service and Privacy Policy.
            </p>
            <ul className={'mt-5 space-y-5'}>
              {sdk?.walletProviders
                .filter((p) => p.isVisible(false))
                .map((p) => {
                  return <WalletItem provider={p} closeModal={closeModal} />
                })}
            </ul>
          </>
        )}

        {isSignedIn && (
          <>
            <h1 className={'text-2xl font-bold text-[#111827]'}>My Account</h1>
            <div className={'flex flex-row items-center space-x-2'}>
              <div></div>
              <div className={'flex flex-col'}>
                <p className={'text-gray-500'}>Address</p>
                <p>{omitMiddle(walletAddress, 8)}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className={
                'flex w-full flex-row justify-between rounded-[10px] bg-[#F7FAFC] p-[15px] pb-[15px] pl-5 pr-[35px] text-[#718096] disabled:cursor-not-allowed'
              }
            >
              <span>Sign out</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
