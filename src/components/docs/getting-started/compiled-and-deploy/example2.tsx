'use client'

import dynamic from 'next/dynamic'

const AbiDisplay = dynamic(() => import('./abi-display'), { ssr: false })

export default function CompiledAndDeploy() {
  return (
    <div>
      <AbiDisplay />
    </div>
  )
}
