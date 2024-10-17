'use client'

import dynamic from 'next/dynamic'

const InteractWithRemixAbi = dynamic(
  () => import('./interact-with-remix-abi'),
  { ssr: false },
)

export default function Example3() {
  return (
    <div>
      <InteractWithRemixAbi />
    </div>
  )
}
