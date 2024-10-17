'use client'

import dynamic from 'next/dynamic'

const AbiDisplay = dynamic(() => import('./abi-display'), { ssr: false })

export default function Example2() {
  return (
    <div>
      <AbiDisplay />
    </div>
  )
}
