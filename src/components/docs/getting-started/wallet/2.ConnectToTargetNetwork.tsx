'use client'
import { Button } from '@/components/shared/Button'
import { StepItemComponent } from '@/components/step-item'
import { axiomGemeni } from '@/lib/network'
import { useWallet } from 'web3-connect-react'

export default function ConnectToTargetNetwork({ session }: { session?: any }) {
  const { isSignedIn, chainId, switchNetwork } = useWallet()
  const isAuth = session === undefined ? false : session.isAuth
  if (!isAuth) {
    return <></>
  }

  return (
    <StepItemComponent step={1} isDone={chainId === axiomGemeni.chainId}>
      {chainId && (
        <div className="flex w-full flex-row flex-wrap items-center justify-between">
          {chainId === axiomGemeni.chainId ? (
            <div>
              <span className="font-medium">
                You are connected to the {axiomGemeni.networkName} network.
              </span>
            </div>
          ) : (
            <>
              <span>
                You are on the different network. Please switch to the{' '}
                {axiomGemeni.networkName} network.
              </span>
              <Button
                onClick={() => {
                  switchNetwork(axiomGemeni)
                }}
              >
                Switch network
              </Button>
            </>
          )}
        </div>
      )}
      {!chainId && <div>Loading...</div>}
    </StepItemComponent>
  )
}
