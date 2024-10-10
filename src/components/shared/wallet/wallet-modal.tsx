import { signIn as serverSignIn, storeSession } from '@/actions/actions'
import { X } from 'lucide-react'
import { cloneElement, useCallback, useState } from 'react'
import {
  AvailableProvider,
  useWallet,
  WalletProvider,
} from 'web3-connect-react'
import { Button } from '@/components/ui/button'

interface Props {
  closeModal: () => void
  isSignedIn: boolean
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
  const image = cloneElement(provider.metadata.image as any, {
    className: 'rounded-lg !h-5 !w-5 !object-cover',
  })

  const { sdk, signIn } = useWallet()
  const [isLoading, setIsLoading] = useState(false)

  const onSignIn = useCallback(
    async (provider: AvailableProvider) => {
      setIsLoading(true)
      await signIn(provider, {
        onSignedIn: async (walletAddress, provider, session) => {
          const { error } = await storeSession(walletAddress, session)
          if (error) {
            throw new Error(error)
          }
        },
        getSignInData: async (address, provider) => {
          const message = 'Sign In to MSBD 5017 website'
          const signature = await provider.signMessage(message, {
            forAuthentication: true,
          })
          const { error } = await serverSignIn(address, message, signature)
          if (error) {
            throw new Error(error)
          }
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
      window.open(provider.metadata.downloadLink, '_blank')
      closeModal()
    } else {
      onSignIn(provider.metadata.name)
    }
  }

  return (
    <div
      key={provider.metadata.name}
      className={'h-[80px] w-full'}
      style={{
        listStyle: 'none',
      }}
    >
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
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${provider.metadata.name === 'MetaMask' ? 'bg-[#EAE0D7]' : 'bg-black'}`}
            >
              {image}
            </div>
            <label className={'text-sm font-bold'}>
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
    </div>
  )
}

export function ConnectWalletModal({ closeModal, isSignedIn }: Props) {
  const { sdk, walletAddress, signOut } = useWallet()

  return (
    <div className={'flex p-8'}>
      <div
        className={
          'mx-auto flex w-full flex-col items-center justify-center space-y-5'
        }
      >
        <button
          className={'absolute right-10 top-10'}
          onClick={() => {
            closeModal()
          }}
        >
          <X />
        </button>
        {!isSignedIn && (
          <>
            <h1 className={'text-center text-2xl font-bold text-primary'}>
              Sign In To MSBD 5017 Website
            </h1>
            <p className={'text-center text-sm font-normal'}>
              Click on the wallet provider you would like to use to sign in to
              the MSBD 5017 website
            </p>
            <div className={'mt-5 w-full space-y-5'}>
              {sdk?.walletProviders
                .filter((p) => p.isVisible(false))
                .map((p) => {
                  return <WalletItem provider={p} closeModal={closeModal} />
                })}
            </div>
          </>
        )}

        {isSignedIn && (
          <div className="mx-auto">
            <h1 className={'text-2xl font-bold'}>My Account</h1>
            <div className={'flex flex-row items-center space-x-2 py-2'}>
              <div></div>
              <div className={'flex flex-col'}>
                <span className={''}>Address</span>
                <span>{omitMiddle(walletAddress ?? '', 8)}</span>
              </div>
            </div>
            <div>
              <Button
                onClick={() => {
                  signOut()
                  closeModal()
                }}
                className={
                  'flex w-96 flex-row justify-between rounded-lg disabled:cursor-not-allowed'
                }
              >
                <span>Sign out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
