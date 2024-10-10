import { session } from '@/actions/actions'
import ConnectWalletExample from './1.ConnectWalletExample'
import ConnectToTargetNetwork from './2.ConnectToTargetNetwork'

export default async function Example() {
  const currentSession = await session()

  console.log(currentSession)

  return (
    <>
      <ConnectWalletExample session={currentSession} />
      <ConnectToTargetNetwork session={currentSession} />
    </>
  )
}
