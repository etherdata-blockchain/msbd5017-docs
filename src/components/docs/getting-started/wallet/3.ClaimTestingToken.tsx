'use client'
import { Button } from '@/components/shared/Button'
import { StepItemComponent } from '@/components/step-item'
import { axiomGemeni } from '@/lib/network'
import { useWallet } from 'web3-connect-react'

const minimumBalance = 10

export default function ClaimTestingToken({ session }: { session?: any }) {
  const { isSignedIn, chainId, balance } = useWallet()
  const isAuth = session === undefined ? false : session.isAuth
  if (!isAuth) {
    return <></>
  }

  if (chainId !== axiomGemeni.chainId) {
    return <></>
  }

  return (
    <StepItemComponent
      step={2}
      isDone={Number(balance) > minimumBalance}
      isLast
    >
      {Number(balance) < minimumBalance ? (
        <div className="flex w-full flex-row items-center justify-between">
          <>
            <span>
              You have less than {minimumBalance} {axiomGemeni.symbol} in your
              wallet. Claim
              {axiomGemeni.networkName} network.
            </span>
            <Button
              onClick={() => {
                window.open('https://faucet.gemini.axiomesh.io', '_blank')
              }}
            >
              Claim Token
            </Button>
          </>
        </div>
      ) : (
        <div>
          <span className="font-medium">
            You have more than {minimumBalance} {axiomGemeni.symbol} in your
            wallet. You are ready to start the tutorial.
          </span>
        </div>
      )}
    </StepItemComponent>
  )
}
