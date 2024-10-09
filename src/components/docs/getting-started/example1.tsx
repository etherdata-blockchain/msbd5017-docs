'use client'

import { source, checker } from '@/components/docs/source-code/helloworld.solc'
import dynamic from 'next/dynamic'

const SolidityContextProvider = dynamic(
  () =>
    import('@/context/solidityContext').then(
      (mod) => mod.SolidityContextProvider,
    ),
  { ssr: false },
)

const Editor = dynamic(() => import('@/components/solc/Editor'), { ssr: false })

const Example1Executor = dynamic(() => import('./example1.executor'), {
  ssr: false,
})

export default function Example1() {
  return (
    <SolidityContextProvider>
      <Editor sourceCode={source} checker={checker} height="500px" />
      <Example1Executor />
    </SolidityContextProvider>
  )
}
