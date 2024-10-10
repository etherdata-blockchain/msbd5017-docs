import { session } from '@/actions/actions'
import ConnectWalletExample from './1.ConnectWalletExample'
import ConnectToTargetNetwork from './2.ConnectToTargetNetwork'
import ClaimTestingToken from './3.ClaimTestingToken'

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
