'use client'

import { source, checker } from '@/components/docs/source-code/hands-on.solc'
import dynamic from 'next/dynamic'

const SolidityContextProvider = dynamic(
  () =>
    import('@/context/solidityContext').then(
      (mod) => mod.SolidityContextProvider,
    ),
  { ssr: false },
)

const Editor = dynamic(() => import('@/components/solc/Editor'), { ssr: false })

export default function HandsOnExample() {
  return (
    <SolidityContextProvider>
      <Editor sourceCode={source} checker={checker} height="500px" />
    </SolidityContextProvider>
  )
}
