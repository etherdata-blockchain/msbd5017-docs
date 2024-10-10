import { session } from '@/actions/actions'
import dynamic from 'next/dynamic'

const ConnectWalletExample = dynamic(() => import('./1.ConnectWalletExample'), {
  ssr: false,
})

const ConnectToTargetNetwork = dynamic(
  () => import('./2.ConnectToTargetNetwork'),
  {
    ssr: false,
  },
)

const ClaimTestingToken = dynamic(() => import('./3.ClaimTestingToken'), {
  ssr: false,
})

export default async function Example() {
  const currentSession = await session()

  return (
    <>
      <ConnectWalletExample session={currentSession} />
      <ConnectToTargetNetwork session={currentSession} />
      <ClaimTestingToken session={currentSession} />
    </>
  )
}
