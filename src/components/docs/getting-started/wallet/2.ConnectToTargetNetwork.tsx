'use client'
import { StepItemComponent } from '@/components/step-item'
import { useWallet } from 'web3-connect-react'

export default function ConnectToTargetNetwork() {
  const { isSignedIn } = useWallet()

  if (!isSignedIn) {
    return <></>
  }

  return (
    <StepItemComponent step={1} isDone={false} isLast>
      <div></div>
    </StepItemComponent>
  )
}
