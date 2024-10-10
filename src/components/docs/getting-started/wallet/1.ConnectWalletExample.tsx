'use client'

import { Button } from '@/components/shared/Button'
import ConnectWalletButton from '@/components/shared/ConnectWalletButton'
import { StepItemComponent } from '@/components/step-item'
import { useWallet } from 'web3-connect-react'

export default function ConnectWalletExample() {
  const { isSignedIn, walletAddress, signOut } = useWallet()

  return (
    <StepItemComponent step={0} isDone={isSignedIn}>
      {isSignedIn ? (
        <div className="flex h-full w-full flex-row items-center justify-between">
          <span>
            <span>You are connected to your wallet.</span>
            <br /> <span className="font-bold">Wallet: {walletAddress}</span>
          </span>
          <div>
            <Button onClick={signOut}>Sign out</Button>
          </div>
        </div>
      ) : (
        <ConnectWalletButton />
      )}
    </StepItemComponent>
  )
}
